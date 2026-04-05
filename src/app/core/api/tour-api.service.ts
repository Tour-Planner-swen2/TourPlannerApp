import { Injectable } from '@angular/core';
import { TravelType } from '../models/travel-types.model';
import { Tour } from '../models/tour.model';
import { catchError, delay, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TourApiService {
  private mockTours: Tour[] = [
    {
      tourId: 'tour-1111-uuid',
      createdBy: 'user-001',
      title: 'Weekend Trip to Salzburg',
      description: "Visiting the mountains and Mozart's birthplace.",
      route: {
        routeId: 'route-1111-uuid',
        start: 'Vienna',
        destination: 'Salzburg',
        traveltype: TravelType.Car,
        distance: 295,
        duration: 180,
        information: 'A beautiful and scenic drive along the A1 autobahn.',
      },
    },
    {
      tourId: 'tour-2222-uuid',
      createdBy: 'user-002',
      title: 'Danube Twin City Ride',
      description: 'A flat, relaxing cycling trip along the Danube river crossing the border.',
      route: {
        routeId: 'route-2222-uuid',
        start: 'Vienna',
        destination: 'Bratislava',
        traveltype: TravelType.Bike,
        distance: 65,
        duration: 200,
        information: 'Well-paved bike paths following the Donauradweg strictly.',
      },
    },
    {
      tourId: 'tour-3333-uuid',
      createdBy: 'user-001',
      title: 'Tyrolean Alps Hike',
      description: 'Challenging but rewarding day hike with panoramic mountain views.',
      route: {
        routeId: 'route-3333-uuid',
        start: 'Innsbruck',
        destination: 'Seefeld',
        traveltype: TravelType.Run,
        distance: 22,
        duration: 360,
        information: 'Steep inclines and rocky paths. Hiking boots required.',
      },
    },
    {
      tourId: 'tour-4444-uuid',
      createdBy: 'user-003',
      title: 'Southern Styria Getaway',
      description: 'Exploring the famous Austrian wine region and the Graz clock tower.',
      route: {
        routeId: 'route-4444-uuid',
        start: 'Vienna',
        destination: 'Graz',
        traveltype: TravelType.Hike,
        distance: 200,
        duration: 150,
        information: 'Smooth drive down the A2 highway with plenty of rest stops.',
      },
    },
    {
      tourId: 'tour-5555-uuid',
      createdBy: 'user-002',
      title: 'Salzkammergut Lake Tour',
      description: 'Visiting the picturesque lake district and historic salt mines.',
      route: {
        routeId: 'route-5555-uuid',
        start: 'Salzburg',
        destination: 'Hallstatt',
        traveltype: TravelType.Bike,
        distance: 72,
        duration: 250,
        information: 'Hilly terrain with stunning lake-side views. E-bike recommended.',
      },
    },
  ];

  apiKey: string = environment.orsApiKey;
  constructor(private http: HttpClient) {}

  getTours(): Observable<Tour[]> {
    //ToDo: My APi call for getting real data from database
    return of([...this.mockTours]).pipe(delay(200));
  }

  updateTour(updatedTour: Tour): Observable<Tour> {
    //ToDo: My APi call for sending updated object to Api for || Patch or Put

    const index = this.mockTours.findIndex((t) => t.tourId === updatedTour.tourId);
    if (index === -1) {
      console.warn('Tour zum Updaten nicht gefunden!');
      return of({ ...updatedTour }).pipe(delay(200));
    }

    const existingTour = this.mockTours[index];

    if (
      existingTour.route.start !== updatedTour.route.start ||
      existingTour.route.destination !== updatedTour.route.destination ||
      existingTour.route.traveltype !== updatedTour.route.traveltype
    ) {
      return this.getDurationAndDistance(
        updatedTour.route.start,
        updatedTour.route.destination,
        updatedTour.route.traveltype,
      ).pipe(
        map((routingData) => {
          updatedTour.route.duration = routingData.duration;
          updatedTour.route.distance = routingData.distance;

          this.mockTours[index] = { ...updatedTour };
          return { ...updatedTour };
        }),
      );
    } else {
      this.mockTours[index] = { ...updatedTour };

      return of({ ...updatedTour }).pipe(delay(200));
    }
  }

  addTour(newTour: Tour): Observable<Tour> {
    //ToDo: temporary fix until real APi call
    const factor: number = Math.random();
    newTour.tourId = `tour-${Math.floor(factor * 10000)}-uuid`;

    return this.getDurationAndDistance(
      newTour.route.start,
      newTour.route.destination,
      newTour.route.traveltype,
    ).pipe(
      map((routingData) => {
        newTour.route.duration = routingData.duration;
        newTour.route.distance = routingData.distance;

        this.mockTours.push({ ...newTour });
        return { ...newTour };
      }),
    );
  }

  deleteTour(tourId: string): Observable<boolean> {
    this.mockTours = this.mockTours.filter((t) => t.tourId !== tourId);
    //ToDo: My APi call for deleting the tour in database || DELETE

    return of(true).pipe(delay(200));
  }
  getDurationAndDistance(
    start: string,
    destination: string,
    travelType: TravelType,
  ): Observable<{ duration: number; distance: number }> {
    if (!this.apiKey || this.apiKey.trim() === '') {
      console.warn('No ORS API Key found in environment. Using mock routing data.');
      return this.RandomDurationAndDistance();
    }
    return forkJoin({
      startCoordinates: this.getCoordinates(start),
      destinationCoordinates: this.getCoordinates(destination),
    }).pipe(
      switchMap(({ startCoordinates, destinationCoordinates }) => {
        if (!(startCoordinates && destinationCoordinates)) {
          console.warn(
            'Could not retrieve coordinates for start or destination. Using Mock routing Data.',
          );
          return this.RandomDurationAndDistance();
        }
        const profile = this.getOrsProfile(travelType);
        const routeUrl = `https://api.openrouteservice.org/v2/directions/${profile}`;
        const body = { coordinates: [startCoordinates, destinationCoordinates] };
        const headers = new HttpHeaders({
          Authorization: this.apiKey,
          'Content-Type': 'application/json; charset=utf-8',
        });
        return this.http.post<any>(routeUrl, body, { headers }).pipe(
          map((routeResponse) => {
            if (!routeResponse.routes || routeResponse.routes.length === 0) {
              throw new Error('No valid route found between these locations.');
            }
            const summary = routeResponse.routes[0].summary;
            return this.oRSFormatter(summary.duration, summary.distance);
          }),
          catchError((e) => {
            console.error('Routing API Error:', e);
            return this.RandomDurationAndDistance();
          }),
        );
      }),
    );
  }

  RandomDurationAndDistance(): Observable<{ duration: number; distance: number }> {
    const factor: number = Math.random();
    return of({
      duration: Math.floor(factor * 300),
      distance: Math.floor(factor * 500),
    }).pipe(delay(200));
  }

  //[longitude, latitude]
  getCoordinates(city: string): Observable<number[] | null> {
    const geocodeUrl = `https://api.openrouteservice.org/geocode/search?api_key=${this.apiKey}&text=${city}`;
    return this.http.get<any>(geocodeUrl).pipe(
      map((response) => {
        if (response.features && response.features.length > 0) {
          return response.features[0].geometry.coordinates;
        }
        return null;
      }),
      catchError((e) => {
        console.error('API Error for city:', city, e);
        return of(null);
      }),
    );
  }

  private getOrsProfile(travelType: string): string {
    switch (travelType) {
      case 'Bike':
        return 'cycling-regular';
      case 'Hike':
        return 'foot-hiking';
      case 'Run':
        return 'foot-walking';
      case 'Car':
        return 'driving-car';
      default:
        return 'cycling-regular';
    }
  }

  oRSFormatter(duration: number, distance: number): { duration: number; distance: number } {
    return {
      duration: Math.round(duration / 60),
      distance: Math.round(distance / 1000)
    };
  }
}
