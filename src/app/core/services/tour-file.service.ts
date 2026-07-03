import { Injectable } from '@angular/core';
import { TourDto } from '../dtos/tour.dto';
import { TourLog } from '../models/tour-log.model';

export interface TourExportData {
  tour: TourDto;
  tourLogs: TourLog[] | null;
}

@Injectable({
  providedIn: 'root',
})
export class TourFileService {
  downloadTour(tour: TourDto, tourLogs: TourLog[] | null): void {
    const exportData: TourExportData = {
      tour: {
        tourId: tour.tourId,
        title: tour.title,
        description: tour.description,
        route: tour.route,
      },
      tourLogs,
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tour.title || 'tour'}.tour`;
    link.click();
    URL.revokeObjectURL(url);
  }

  uploadTour(file: File): Promise<TourExportData> {
    return new Promise((resolve, reject) => {
      if (!this.isValidFileType(file)) {
        reject(new Error('Invalid file type. Please upload a .tour file.'));
        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const data = JSON.parse(content);

          if (!this.isValidTourData(data)) {
            reject(new Error('Invalid tour file format.'));
            return;
          }

          resolve(data as TourExportData);
        } catch (error) {
          reject(new Error('Failed to parse tour file.'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file.'));
      };

      reader.readAsText(file);
    });
  }

  private isValidFileType(file: File): boolean {
    return file.name.endsWith('.tour');
  }

  private isValidTourData(data: unknown): boolean {
    if (typeof data !== 'object' || data === null) {
      return false;
    }

    const obj = data as Record<string, unknown>;

    if (!obj['tour'] || typeof obj['tour'] !== 'object') {
      return false;
    }

    const tour = obj['tour'] as Record<string, unknown>;

    if (
      !tour['title'] ||
      !tour['description'] ||
      !tour['route'] ||
      typeof tour['route'] !== 'object'
    ) {
      return false;
    }

    const route = tour['route'] as Record<string, unknown>;

    return (
      (!!route['start'] && !!route['destination'] && !!route['travelType']) || !!route['traveltype']
    );
  }
}


