import { Component, inject } from '@angular/core';

import { TourList } from './components/tour-list/tour-list';
import { SearchBar } from './components/search-bar/search-bar';
import { Map } from './components/map/map';
import { TourDetails } from './components/tour-details/tour-details';
import { TourListItemModal } from '../../shared/ui-components/tour-list-item-modal/tour-list-item-modal';
import { TourFacade } from '../../core/facades/tour.facade';
import { TourLogFacade } from '../../core/facades/tourlog.facade';
import { TourDto } from '../../core/dtos/tour.dto';
import { TourLog } from '../../core/models/tour-log.model';
import { TravelType } from '../../core/models/travel-types.model';

@Component({
  selector: 'app-dashboard',
  imports: [TourList, SearchBar, Map, TourDetails, TourListItemModal],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  modalTourData!: TourDto | null;
  modalTourId: string | null = null;
  private tourFacade = inject(TourFacade);
  private tourLogFacade = inject(TourLogFacade);

  openModal(tourId: string | null) {
    this.modalTourId = tourId;
    if (tourId !== null) {
      const selectedTour = this.tourFacade.selectedTour();
      if (selectedTour) {
        this.modalTourData = {
          title: selectedTour.title,
          description: selectedTour.description,
          route: selectedTour.route,
        };
      }
    } else {
      this.modalTourData = {
        title: '',
        description: '',
        route: {
          start: '',
          destination: '',
          travelType: TravelType.Bike,
          distance: 0,
          duration: '00:00:00',
        },
      };
    }
  }

  closeModal() {
    this.modalTourData = null;
    this.modalTourId = null;
  }

  saveTourChanges(tourData: TourDto) {
    if (this.modalTourId) {
      this.tourFacade.updateTour(this.modalTourId, tourData);
    } else {
      this.tourFacade.addTour(tourData);
    }
    this.closeModal();
  }

  saveTourChangesWithLogs(data: { tour: TourDto; tourLogs: TourLog[] | null }) {
    if (this.modalTourId) {
      this.tourFacade.updateTour(this.modalTourId, data.tour);
      if (data.tourLogs && data.tourLogs.length > 0) {
        data.tourLogs.forEach((log) => {
          this.tourLogFacade.addTourLog({
            ...log,
            tourLogId: '',
            tourId: this.modalTourId!,
          });
        });
      }
    } else {
      this.tourFacade.addTour(data.tour);
      if (data.tourLogs && data.tourLogs.length > 0) {
        data.tourLogs.forEach((log) => {
          this.tourLogFacade.addTourLog({
            ...log,
            tourLogId: '',
            tourId: '',
          });
        });
      }
    }
    this.closeModal();
  }
}
