import { Component, effect, inject, ViewChild, ElementRef, AfterViewInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { GeocodingService } from '../../../../core/api/geocoding-api.service';
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
  private map: import('leaflet').Map | null = null;
  private L: typeof import('leaflet') | null = null;
  private currentMarkers: import('leaflet').Marker[] = [];

  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;

  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    this.L = await import('leaflet');

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

    this.geocodingService.geocode(tour.route.start).then(startCoords => {
      this.geocodingService.geocode(tour.route.destination).then(destCoords => {
        if (!startCoords || !destCoords) return;

        const startMarker = this.L!.marker(startCoords).addTo(this.map!).bindPopup(`Start: ${tour.route.start}`);
        const destMarker = this.L!.marker(destCoords).addTo(this.map!).bindPopup(`Destination: ${tour.route.destination}`);

        this.currentMarkers = [startMarker, destMarker];

        this.map!.fitBounds(this.L!.latLngBounds([startCoords, destCoords]), { padding: [50, 50] });
      });
    });
  });

}
