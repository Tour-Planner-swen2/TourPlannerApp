import { inject, Injectable, signal } from '@angular/core';
import { Tour } from '../models/tour.model';
import { TourApiService } from '../api/tour-api.service';

@Injectable({
  providedIn: 'root',
})
export class TourFacade {
  private tourApi: TourApiService = inject(TourApiService);
  private _tours = signal<Tour[]>([]);
  private _selectedTour = signal<Tour | null>(null);

  tours = this._tours.asReadonly();
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
    this.tourApi.deleteTour(tourId).subscribe(() => {
      this._tours.update((currentTours) => currentTours.filter((t) => t.tourId !== tourId));
    });
  }
}
