import { Injectable } from '@angular/core';
import {  forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouteApiService } from './route-api.service';
import { TourDto, TourResponseDto } from '../dtos/tour.dto';

@Injectable({
  providedIn: 'root',
})
export class TourApiService {
  private apiUrl = `${environment.apiUrl}/Tour`;

  constructor(
    private http: HttpClient,
    private routeApiService: RouteApiService
  ) {}

  getTours(filter?: string): Observable<TourResponseDto[]> {
    const url = filter
      ? `${this.apiUrl}?filter=${encodeURIComponent(filter)}`
      : this.apiUrl;
    return this.http.get<TourResponseDto[]>(url).pipe(
      switchMap((tours) => this.loadRoutesForTours(tours))
    );
  }

  getAllTours(): Observable<TourResponseDto[]> {
    return this.http.get<TourResponseDto[]>(`${this.apiUrl}/all`).pipe(
      switchMap((tours) => this.loadRoutesForTours(tours))
    );
  }

  getTourById(id: string): Observable<TourResponseDto> {
    return this.http.get<TourResponseDto>(`${this.apiUrl}/${id}`).pipe(
      switchMap((tour) => {
        if (tour.route && tour.route.routeId) {
          return this.routeApiService.getRouteById(tour.route.routeId).pipe(
            map((route) => ({ ...tour, route }))
          );
        }
        return of(tour);
      })
    );
  }

  private loadRoutesForTours(tours: TourResponseDto[]): Observable<TourResponseDto[]> {
    if (tours.length === 0) {
      return of(tours);
    }

    const routeRequests = tours.map((tour) => {
      if (tour.route && tour.route.routeId) {
        return this.routeApiService.getRouteById(tour.route.routeId).pipe(
          map((route) => ({ ...tour, route }))
        );
      }
      return of(tour);
    });

    return forkJoin(routeRequests);
  }

  updateTour(id: string, updatedTourDto: TourDto): Observable<TourResponseDto> {
    return this.getTourById(id).pipe(
      switchMap((existingTour) => {
        const existingRoute = existingTour.route;
        const newRoute = updatedTourDto.route;

        if (
          existingRoute.start !== newRoute.start ||
          existingRoute.destination !== newRoute.destination ||
          existingRoute.traveltype !== newRoute.traveltype
        ) {
          return this.routeApiService.updateRoute(
            existingRoute.routeId,
            newRoute
          ).pipe(
            switchMap((updatedRoute) => {
              return this.http.patch<TourResponseDto>(
                `${this.apiUrl}/${id}`,
                updatedTourDto
              ).pipe(
                map((tour) => ({ ...tour, route: updatedRoute }))
              );
            })
          );
        } else {
          return this.http.patch<TourResponseDto>(
            `${this.apiUrl}/${id}`,
            updatedTourDto
          ).pipe(
            map((tour) => ({ ...tour, route: existingRoute }))
          );
        }
      })
    );
  }

  addTour(newTourDto: TourDto): Observable<TourResponseDto> {
    console.log(newTourDto);
    return this.routeApiService.createRoute(newTourDto.route).pipe(
      switchMap((createdRoute) => {
        const tourWithRoute: TourDto = {
          ...newTourDto,
          route: createdRoute,
        };

        return this.http.post<TourResponseDto>(this.apiUrl, tourWithRoute).pipe(
          switchMap((createdTour) => {
            if (createdTour.route && createdTour.route.routeId) {
              return this.routeApiService.getRouteById(createdTour.route.routeId).pipe(
                map((route) => ({ ...createdTour, route }))
              );
            }
            return of(createdTour);
          })
        );
      })
    );
  }
  deleteTour(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
