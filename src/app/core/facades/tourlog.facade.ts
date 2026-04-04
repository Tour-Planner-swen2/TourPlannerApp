import { computed, inject, Injectable, signal } from '@angular/core';
import { TourlogApiService } from '../api/tourlog-api.service';
import { TourLog } from '../models/tour-log.model';

@Injectable({
  providedIn: 'root',
})
export class TourLogFacade {
  private tourLogApi: TourlogApiService = inject(TourlogApiService);
  private _tourLogs = signal<TourLog[]>([]);
  private _toursLogsAmount = signal<number>(0);

  private _searchTerm = signal<string>('');

  tourLogs = computed(() => {
    const allTourLogs = this._tourLogs();
    const term = this._searchTerm().toLowerCase().trim();

    if (!term || '') {
      return allTourLogs;
    }

    const filterTourLogs: TourLog[] = allTourLogs.filter((tourLog) => tourLog.comment.toLowerCase().includes(term));
    this._toursLogsAmount.set(filterTourLogs.length);
    return filterTourLogs;
  });
  toursLogsAmount = this._toursLogsAmount.asReadonly();

  loadTourLogs(tourId: string, currentIndex: number | null, amount: number | null): void {
    this.tourLogApi.getTourLogs(tourId, currentIndex, amount).subscribe((tourLogs) => {
      this._tourLogs.set(tourLogs);
    });
  }

  loadTourLogsAmount(tourId: string): void {
    this.tourLogApi.getTourLogsAmount(tourId).subscribe((amount) => {
      this._toursLogsAmount.set(amount);
    });
  }

  updateTourLog(updatedTourLog: TourLog): void {
    this.tourLogApi.updateTourLog(updatedTourLog).subscribe(() => {
      this._tourLogs.update((currentTourLogs) =>
        currentTourLogs.map((tourLog) =>
          tourLog.tourLogId === updatedTourLog.tourLogId ? updatedTourLog : tourLog,
        ),
      );
    });
  }

  addTourLog(newTourLog: TourLog): void {
    this.tourLogApi.addTourLog(newTourLog).subscribe((addedTourLog) => {
      this._tourLogs.update((currentTours) => [...currentTours, addedTourLog]);
      this._toursLogsAmount.update((amount) => amount + 1);
    });
  }

  deleteTourLog(tourLogId: string): void {
    this.tourLogApi.deleteTourLog(tourLogId).subscribe(() => {
      this._tourLogs.update((currentTourLogs) =>
        currentTourLogs.filter((t) => t.tourLogId !== tourLogId),
      );
      this._toursLogsAmount.update((amount) => amount - 1);
    });
  }

  filterTourLogs(searchTerm: string): void {
    this._searchTerm.set(searchTerm);
  }
}
