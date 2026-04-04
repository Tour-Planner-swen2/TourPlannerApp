import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GeocodingService {
  async geocode(city: string): Promise<[number, number] | null> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`
      );
      const data = await response.json();
      if (data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
    } catch (e) {
      console.error('Geocoding error:', e);
    }
    return null;
  }
}
