import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { TourLog } from '../models/tour-log.model';

@Injectable({
  providedIn: 'root',
})
export class TourlogApiService {
  private mockTourLogs: TourLog[] = [
    {
      tourLogId: 'log-001-uuid',
      tourId: 'tour-1111-uuid',
      date: '12-05-2024',
      comment: 'Excellent weather conditions. The trail was clear and well-marked.',
      difficulty: 3,
      distance: 12.5,
      duration: 180, // in minutes
      rating: 5,
    },
    {
      tourLogId: 'log-002-uuid',
      tourId: 'tour-1111-uuid',
      date: '20-05-2024',
      comment: 'A bit muddy after the rain. Took longer than expected.',
      difficulty: 4,
      distance: 12.5,
      duration: 215,
      rating: 3,
    },
    {
      tourLogId: 'log-003-uuid',
      tourId: 'tour-1111-uuid',
      date: '02-06-2024',
      comment: 'Quick evening run. Felt great!',
      difficulty: 2,
      distance: 10.0,
      duration: 120,
      rating: 4,
    },
    {
      tourLogId: 'log-004-uuid',
      tourId: 'tour-1111-uuid',
      date: '15-06-2024',
      comment: 'Struggled with the elevation gain today. Need better boots.',
      difficulty: 5,
      distance: 15.2,
      duration: 300,
      rating: 2,
    },
    {
      tourLogId: 'log-005-uuid',
      tourId: 'tour-1111-uuid',
      date: '17-06-2024',
      comment: 'It was amazing!!!',
      difficulty: 6,
      distance: 15.4,
      duration: 304,
      rating: 5,
    },
  ];
  getTourLogs(tourId: string, currentIndex: number | null, amount: number | null): Observable<TourLog[]> {
    //ToDo: My APi call for getting real data from database
    delay(200);
    //if (currentIndex === null || amount === null)
        return of([...this.mockTourLogs.filter((tourLog) => tourLog.tourId === tourId)]);
    //return of([...this.mockTourLogs.filter((tourLog) => tourLog.tourId === tourId).slice(currentIndex, currentIndex + amount)]);
  }

  getTourLogsAmount(tourId: string): Observable<number> {
    //ToDo: My APi call for getting real data from database
    delay(200);

    return of(this.mockTourLogs.filter((tourLog) => tourLog.tourId === tourId).length);
  }
  updateTourLog(updatedTour: TourLog): Observable<TourLog> {
    delay(200);
    const index = this.mockTourLogs.findIndex((t) => t.tourId === updatedTour.tourId);
    if (index !== -1) {
      this.mockTourLogs[index] = { ...updatedTour };
    }
    //ToDo: My APi call for sending updated object to Api for || Patch or Put

    return of({ ...updatedTour });
  }

  addTourLog(newTour: TourLog): Observable<TourLog> {
    delay(200);

    const factor: number = Math.random();
    newTour.tourLogId = `tour-log-${Math.floor(factor * 10000)}-uuid`;

    this.mockTourLogs.push({ ...newTour });
    //ToDo: My APi call for: getting correct Id/dISTANCE/tIME  || POST
    return of({ ...newTour });
  }

  deleteTourLog(tourLogId: string): Observable<boolean> {
    delay(200);
    this.mockTourLogs = this.mockTourLogs.filter((t) => t.tourLogId !== tourLogId);
    //ToDo: My APi call for deleting the tour in database || DELETE

    return of(true);
  }
}
