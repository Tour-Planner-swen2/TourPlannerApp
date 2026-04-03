import { computed, inject, Injectable, signal } from '@angular/core';
import { Tour } from '../models/tour.model';
import { TourApiService } from '../api/tour-api.service';

@Injectable({
  providedIn: 'root',
})
export class TourFacade {
  private tourApi: TourApiService = inject(TourApiService);
  private _tours = signal<Tour[]>([]);
  private _selectedTour = signal<Tour | null>(null);

  private _searchTerm = signal<string>('');

  tours = computed(() => {
    const allTours = this._tours();
    const term = this._searchTerm().toLowerCase().trim();

    if (!term) {
      return allTours;
    }

    return allTours.filter(
      (tour) =>
        tour.title.toLowerCase().includes(term) ||
        tour.route.start.toLowerCase().includes(term) ||
        tour.route.destination.toLowerCase().includes(term) ||
        tour.route.traveltype.toLowerCase().includes(term),
    );
  });

  selectedTour = this._selectedTour.asReadonly();

  selectTour(tour: Tour | null): void {
    this._selectedTour.set(tour);
  }

  loadTours(): void {
    this.tourApi.getTours().subscribe((tours) => {
      this._tours.set(tours);
    });
  }

  updateTour(updatedTour: Tour): void {
    this.tourApi.updateTour(updatedTour).subscribe(() => {
      this._tours.update((currentTours) =>
        currentTours.map((tour) => (tour.tourId === updatedTour.tourId ? updatedTour : tour)),
      );
    });
  }

  addTour(newTour: Tour): void {
    this.tourApi.addTour(newTour).subscribe((addedTour) => {
      this._tours.update((currentTours) => [...currentTours, addedTour]);
    });
  }

  deleteTour(tourId: string): void {
    console.log(this._tours());
    this.tourApi.deleteTour(tourId).subscribe(() => {
      this._tours.update((currentTours) => currentTours.filter((t) => t.tourId !== tourId));
    });
    console.log(this._tours());
  }

  filterTours(searchTerm: string): void {
    this._searchTerm.set(searchTerm);
  }
}
