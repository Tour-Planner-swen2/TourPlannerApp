import { Component, inject, Signal } from '@angular/core';
import { Tour } from '../../../../core/models/tour.model';
import { TourListItem } from '../tour-list-item/tour-list-item';
import { TourListItemModal } from '../../../../shared/ui-components/tour-list-item-modal/tour-list-item-modal';
import { TourFacade } from '../../../../core/facades/tour.facade';

@Component({
  selector: 'app-tour-list',
  imports: [TourListItem, TourListItemModal],
  templateUrl: './tour-list.html',
  styleUrl: './tour-list.css',
})
export class TourList {
  modalTour!: Tour | null;
  private tourFacade = inject(TourFacade);
  tours: Signal<Tour[]> = this.tourFacade.tours;

  ngOnInit(): void {
    this.tourFacade.loadTours();
  }

  openModal(tour: Tour) {
    this.modalTour = tour;
  }

  closeModal() {
    this.modalTour = null;
  }

  saveTourChanges(updatedTour: Tour) {
    this.tourFacade.updateTour(updatedTour);
    this.closeModal();
  }

  selectTour(tour: Tour | null) {
    this.tourFacade.selectTour(tour);
  }
  deleteData(toDeleteTour: Tour) {
    this.selectTour(null);
    this.tourFacade.deleteTour(toDeleteTour.tourId);
    this.closeModal();
  }
}
