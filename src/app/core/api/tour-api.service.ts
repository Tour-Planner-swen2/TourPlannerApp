import { Injectable } from '@angular/core';
import {  forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { RouteApiService } from './route-api.service';
import { TourDto, TourResponseDto } from '../dtos/tour.dto';

@Injectable({
  providedIn: 'root',
})
export class TourApiService {
  private apiUrl = `${environment.apiUrl}/Tour`;

  constructor(
    private http: HttpClient,
    private routeApiService: RouteApiService,
  ) {}

  getTours(filter?: string): Observable<TourResponseDto[]> {
    const url = filter ? `${this.apiUrl}?filter=${encodeURIComponent(filter)}` : this.apiUrl;
    return this.http
      .get<TourResponseDto[]>(url)
      .pipe(switchMap((tours) => this.loadRoutesForTours(tours || [])));
  }

  loadRoutesForTours(tours: TourResponseDto[]): Observable<TourResponseDto[]> {
    if (!tours || tours.length === 0) {
      return of([]);
    }

    const tourObservables = tours.map((tour) => {
      if (tour && tour.tourId) {
        return this.routeApiService.getRouteById(tour.tourId).pipe(
          map((routeData) => {
            return { ...tour, route: routeData } as TourResponseDto;
          }),
        );
      }

      return of(tour as TourResponseDto);
    });

    return forkJoin(tourObservables);
  }

  getTourById(id: string): Observable<TourResponseDto> {
    return this.http.get<TourResponseDto>(`${this.apiUrl}/${id}`).pipe(
      switchMap((tour) => {
        if (tour && tour.tourId) {
          return this.routeApiService
            .getRouteById(tour.tourId)
            .pipe(map((route) => ({ ...tour, route })));
        }
        return of(tour);
      }),
    );
  }

  updateTour(id: string, updatedTourDto: TourDto): Observable<TourResponseDto> {
    return this.getTourById(id).pipe(
      switchMap((existingTour) => {
        const existingRoute = existingTour.route;
        const newRoute = updatedTourDto.route;

        const payloadToBackend = {
          ...updatedTourDto,
          routeId: existingRoute ? existingRoute.routeId : existingTour.route.routeId,
        };

        if (
          existingRoute &&
          (existingRoute.start !== newRoute.start ||
            existingRoute.destination !== newRoute.destination ||
            existingRoute.travelType !== newRoute.travelType)
        ) {
          return this.routeApiService.updateRoute(existingRoute.routeId, newRoute).pipe(
            switchMap((updatedRoute) => {
              payloadToBackend.routeId = updatedRoute.routeId;

              return this.http
                .patch<TourResponseDto>(`${this.apiUrl}/${id}`, payloadToBackend)
                .pipe(map((tour) => ({ ...tour, route: updatedRoute })));
            }),
          );
        } else {
          return this.http
            .patch<TourResponseDto>(`${this.apiUrl}/${id}`, payloadToBackend)
            .pipe(map((tour) => ({ ...tour, route: existingRoute })));
        }
      }),
    );
  }

  addTour(newTourDto: TourDto): Observable<TourResponseDto> {
    return this.routeApiService.createRoute(newTourDto.route).pipe(
      switchMap((createdRoute) => {
        const payloadToBackend = {
          title: newTourDto.title,
          description: newTourDto.description,
          routeId: createdRoute.routeId,
        };

        return this.http.post<TourResponseDto>(this.apiUrl, payloadToBackend).pipe(
          map((createdTour) => {
            return {
              ...createdTour,
              route: createdRoute,
            };
          }),
        );
      }),
    );
  }
  deleteTour(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
