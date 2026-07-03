import { Component, effect, inject, ViewChild, ElementRef, AfterViewInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { GeocodingService } from '../../../../core/api/geocoding-api.service';
import { RoutingApiService } from '../../../../core/api/routing-api.service';
import { TourFacade } from '../../../../core/facades/tour.facade';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map implements AfterViewInit {

  private tourFacade: TourFacade = inject(TourFacade);
  activeTour = this.tourFacade.selectedTour;
  private platformId = inject(PLATFORM_ID);
  private geocodingService = inject(GeocodingService);
  private routingService = inject(RoutingApiService);
  private map: import('leaflet').Map | null = null;
  private L: typeof import('leaflet') | null = null;
  private currentMarkers: import('leaflet').Marker[] = [];
  private currentRouteLine: import('leaflet').Polyline | null = null;

  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;

async ngAfterViewInit(): Promise<void> {
  if (!isPlatformBrowser(this.platformId)) return;

  this.L = await import('leaflet');

  const iconDefault = this.L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
  this.L.Marker.prototype.options.icon = iconDefault;

  this.map = this.L.map(this.mapContainer.nativeElement).setView([47.8, 13.0], 7);

  this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(this.map);
}


  mapUpdater = effect(() => {
    const tour = this.activeTour();
    if (!tour || !this.map || !this.L) return;

    this.currentMarkers.forEach(marker => marker.remove());
    this.currentMarkers = [];
    this.currentRouteLine?.remove();
    this.currentRouteLine = null;

    this.geocodingService.geocode(tour.route.start).then(startCoords => {
      this.geocodingService.geocode(tour.route.destination).then(destCoords => {
        if (!startCoords || !destCoords) return;

        const startMarker = this.L!.marker(startCoords).addTo(this.map!).bindPopup(`Start: ${tour.route.start}`);
        const destMarker = this.L!.marker(destCoords).addTo(this.map!).bindPopup(`Destination: ${tour.route.destination}`);

        this.currentMarkers = [startMarker, destMarker];

        this.map!.fitBounds(this.L!.latLngBounds([startCoords, destCoords]), { padding: [50, 50] });

        this.routingService
          .getRouteGeometry(startCoords, destCoords, tour.route.traveltype)
          .then(routeCoords => {
            if (!this.map || !this.L) return;

            const path = routeCoords ?? [startCoords, destCoords];
            this.currentRouteLine = this.L.polyline(path, { color: '#2563eb', weight: 4 }).addTo(this.map);
            this.map.fitBounds(this.currentRouteLine.getBounds(), { padding: [50, 50] });
          });
      });
    });
  });

}
