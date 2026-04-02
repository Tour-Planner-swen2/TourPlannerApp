import { Component, inject } from '@angular/core';

import { TourList } from './components/tour-list/tour-list';
import { SearchBar } from './components/search-bar/search-bar';
import { Map } from './components/map/map';
import { TourDetails } from './components/tour-details/tour-details';
import { TourListItemModal } from '../../shared/ui-components/tour-list-item-modal/tour-list-item-modal';
import { Tour } from '../../core/models/tour.model';
import { TourFacade } from '../../core/facades/tour.facade';
import { TravelType } from '../../core/models/travel-types.model';

@Component({
  selector: 'app-dashboard',
  imports: [TourList, SearchBar, Map, TourDetails, TourListItemModal],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  modalTour!: Tour | null;
  private tourFacade = inject(TourFacade);

  openModal(tour: Tour | null) {
    if(tour !== null) {
      this.modalTour = tour;
    }
    else{
      this.modalTour = {
        tourId: '1',
        createdBy: '',
        title: '',
        description: '',
        route: {
          routeId: '',
          start: '',
          destination: '',
          traveltype: TravelType.Bike,
          distance: 0,
          duration: 0,
          information: '',
        },
      };
    }
  }

  closeModal() {
    this.modalTour = null;
  }

  saveTourChanges(updatedTour: Tour) {
    this.tourFacade.addTour(updatedTour);
    this.closeModal();
  }
}
