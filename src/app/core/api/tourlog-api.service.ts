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
      date: '2024-05-12',
      comment: 'Excellent weather conditions. The trail was clear and well-marked.',
      difficulty: 3,
      distance: 12.5,
      duration: 180, // in minutes
      rating: 5,
    },
    {
      tourLogId: 'log-002-uuid',
      tourId: 'tour-1111-uuid',
      date: '2024-05-20',
      comment: 'A bit muddy after the rain. Took longer than expected.',
      difficulty: 4,
      distance: 12.5,
      duration: 215,
      rating: 3,
    },
    {
      tourLogId: 'log-003-uuid',
      tourId: 'tour-1111-uuid',
      date: '2024-06-02',
      comment: 'Quick evening run. Felt great!',
      difficulty: 2,
      distance: 10.0,
      duration: 120,
      rating: 4,
    },
    {
      tourLogId: 'log-004-uuid',
      tourId: 'tour-1111-uuid',
      date: '2024-06-15',
      comment: 'Struggled with the elevation gain today. Need better boots.',
      difficulty: 5,
      distance: 15.2,
      duration: 300,
      rating: 2,
    },
    {
      tourLogId: 'log-005-uuid',
      tourId: 'tour-1111-uuid',
      date: '2024-06-17',
      comment: 'Geilo!!',
      difficulty: 6,
      distance: 15.4,
      duration: 304,
      rating: 5,
    },
  ];
  getTourLogs(tourId: string, currentIndex: number, amount: number): Observable<TourLog[]> {
    //ToDo: My APi call for getting real data from database
    delay(200);

    return of([...this.mockTourLogs.filter((tourLog) => tourLog.tourId === tourId)]);
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

    this.mockTourLogs.push({ ...newTour });
    //ToDo: My APi call for: getting correct Id/dISTANCE/tIME  || POST
    return of({ ...newTour });
  }

  deleteTourLog(tourId: string): Observable<boolean> {
    delay(200);
    this.mockTourLogs = this.mockTourLogs.filter((t) => t.tourId !== tourId);
    //ToDo: My APi call for deleting the tour in database || DELETE

    return of(true);
  }
}
