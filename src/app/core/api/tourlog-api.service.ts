import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { TourLog } from '../models/tour-log.model';

@Injectable({
  providedIn: 'root',
})
export class TourlogApiService {
  private apiUrl = `${environment.apiUrl}/TourLog`;

  constructor(private http: HttpClient) {}

  getTourLogs(
    tourId: string,
    currentIndex: number | null,
    amount: number | null,
  ): Observable<TourLog[]> {
    return this.http.get<TourLog[]>(`${this.apiUrl}/by-tour/${tourId}`).pipe(
      map((logs) => {
        if (!logs) return [];

        return logs.map((log) => {
          if (log.date) {
            const formattedDate = log.date.split('T')[0];
            return { ...log, date: formattedDate };
          }
          return log;
        });
      }),
    );
  }

  getTourLogsAmount(tourId: string): Observable<number> {
    return this.http
      .get<TourLog[]>(`${this.apiUrl}/by-tour/${tourId}`)
      .pipe(map((logs) => (logs ? logs.length : 0)));
  }

  updateTourLog(updatedTourLog: TourLog): Observable<TourLog> {
    const safeTourLog = {
      ...updatedTourLog,
      date: new Date(updatedTourLog.date).toISOString(),
    };

    return this.http.patch<TourLog>(`${this.apiUrl}/${safeTourLog.tourLogId}`, safeTourLog);
  }

  addTourLog(newTourLog: TourLog): Observable<TourLog> {
    const safeTourLog = {
      ...newTourLog,
      date: new Date(newTourLog.date).toISOString(),
    };

    return this.http.post<TourLog>(this.apiUrl, safeTourLog);
  }

  deleteTourLog(tourLogId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${tourLogId}`);
  }
}
