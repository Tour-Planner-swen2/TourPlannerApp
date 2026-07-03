import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TravelType } from '../models/travel-types.model';

const ORS_PROFILE_BY_TRAVEL_TYPE: Record<TravelType, string> = {
  [TravelType.Car]: 'driving-car',
  [TravelType.Bike]: 'cycling-regular',
  [TravelType.Hike]: 'foot-hiking',
  [TravelType.Run]: 'foot-walking',
};

@Injectable({
  providedIn: 'root',
})
export class RoutingApiService {
  async getRouteGeometry(
    start: [number, number],
    destination: [number, number],
    travelType: TravelType
  ): Promise<[number, number][] | null> {
    const profile = ORS_PROFILE_BY_TRAVEL_TYPE[travelType] ?? 'driving-car';

    try {
      const response = await fetch(
        `https://api.openrouteservice.org/v2/directions/${profile}/geojson`,
        {
          method: 'POST',
          headers: {
            Authorization: environment.orsApiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            coordinates: [
              [start[1], start[0]],
              [destination[1], destination[0]],
            ],
          }),
        }
      );

      if (!response.ok) {
        console.error('ORS directions request failed:', await response.text());
        return null;
      }

      const data = await response.json();
      const coordinates: [number, number][] = data.features[0].geometry.coordinates;

      return coordinates.map(([lon, lat]) => [lat, lon]);
    } catch (e) {
      console.error('Routing error:', e);
      return null;
    }
  }
}
