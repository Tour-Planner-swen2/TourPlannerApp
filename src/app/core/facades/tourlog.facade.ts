import { inject, Injectable, signal } from '@angular/core';
import { TourlogApiService } from '../api/tourlog-api.service';
import { TourLog } from '../models/tour-log.model';

@Injectable({
  providedIn: 'root',
})
export class TourLogFacade {
  private tourLogApi: TourlogApiService = inject(TourlogApiService);
  private _tourLogs = signal<TourLog[]>([]);
  private _toursLogsAmount = signal<number>(0);
  tourLogs = this._tourLogs.asReadonly();
  toursLogsAmount = this._toursLogsAmount.asReadonly();

  loadTourLogs(tourId: string, currentIndex: number, amount: number): void {
    this.tourLogApi.getTourLogs(tourId, currentIndex, amount).subscribe((tourLogs) => {
      this._tourLogs.set(tourLogs);
    });
  }

  loadTourLogsAmount(tourId: string): void {
    this.tourLogApi.getTourLogsAmount(tourId).subscribe((amount) => {
      this._toursLogsAmount.set(amount);
      console.log(this._toursLogsAmount);
    });
  }

  updateTourLog(updatedTourLog: TourLog): void {
    this.tourLogApi.updateTourLog(updatedTourLog).subscribe(() => {
      this._tourLogs.update((currentTourLogs) =>
        currentTourLogs.map((tourLog) =>
          tourLog.tourId === updatedTourLog.tourId ? updatedTourLog : tourLog,
        ),
      );
    });
  }

  addTourLog(newTourLog: TourLog): void {
    this.tourLogApi.addTourLog(newTourLog).subscribe((addedTourLog) => {
      this._tourLogs.update((currentTours) => [...currentTours, addedTourLog]);
    });
  }

  deleteTourLog(tourLogId: string): void {
    this.tourLogApi.deleteTourLog(tourLogId).subscribe(() => {
      this._tourLogs.update((currentTourLogs) =>
        currentTourLogs.filter((t) => t.tourLogId !== tourLogId),
      );
    });
  }
}
