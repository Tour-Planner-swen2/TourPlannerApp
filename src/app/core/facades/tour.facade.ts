import { computed, inject, Injectable, signal } from '@angular/core';
import { TourApiService } from '../api/tour-api.service';
import { TourResponseDto, TourDto } from '../dtos/tour.dto';

@Injectable({
  providedIn: 'root',
})
export class TourFacade {
  private tourApi: TourApiService = inject(TourApiService);
  private _tours = signal<TourResponseDto[]>([]);
  private _selectedTour = signal<TourResponseDto | null>(null);

  private _searchTerm = signal<string>('');

  tours = computed(() => {
    const allTours = this._tours();
    const term = this._searchTerm().toLowerCase().trim();

    if (!term || '') {
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

  selectTour(tour: TourResponseDto | null): void {
    this._selectedTour.set(tour);
  }

  loadTours(filter?: string): void {
    this.tourApi.getTours(filter).subscribe({
      next: (tours) => {
        this._tours.set(tours);
      },
      error: (error) => {
        console.error('Error loading tours:', error);
      }
    });
  }

  updateTour(tourId: string, updatedTourDto: TourDto): void {
    this.tourApi.updateTour(tourId, updatedTourDto).subscribe({
      next: (updatedTour) => {
        this._tours.update((currentTours) =>
          currentTours.map((tour) => (tour.tourId === tourId ? updatedTour : tour)),
        );
        this._selectedTour.set(updatedTour);
      },
      error: (error) => {
        console.error('Error updating tour:', error);
      }
    });
  }

  addTour(newTourDto: TourDto): void {
    this.tourApi.addTour(newTourDto).subscribe({
      next: (addedTour) => {
        this._tours.update((currentTours) => [...currentTours, addedTour]);
      },
      error: (error) => {
        console.error('Error adding tour:', error);
      }
    });
  }

  deleteTour(tourId: string): void {
    this.tourApi.deleteTour(tourId).subscribe({
      next: () => {
        this._tours.update((currentTours) => currentTours.filter((t) => t.tourId !== tourId));
        if (this._selectedTour()?.tourId === tourId) {
          this._selectedTour.set(null);
        }
      },
      error: (error) => {
        console.error('Error deleting tour:', error);
      }
    });
  }

  filterTours(searchTerm: string): void {
    this._searchTerm.set(searchTerm);
  }
}
