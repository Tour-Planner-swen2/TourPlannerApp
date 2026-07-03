import { Component, inject, Signal } from '@angular/core';
import { TourListItem } from '../tour-list-item/tour-list-item';
import { TourListItemModal } from '../../../../shared/ui-components/tour-list-item-modal/tour-list-item-modal';
import { TourFacade } from '../../../../core/facades/tour.facade';
import { TourLogFacade } from '../../../../core/facades/tourlog.facade';
import { TourResponseDto, TourDto } from '../../../../core/dtos/tour.dto';
import { TourLog } from '../../../../core/models/tour-log.model';

@Component({
  selector: 'app-tour-list',
  imports: [TourListItem, TourListItemModal],
  templateUrl: './tour-list.html',
  styleUrl: './tour-list.css',
})
export class TourList {
  modalTourData!: TourDto | null;
  modalTourId: string | null = null;
  private tourFacade = inject(TourFacade);
  private tourLogFacade = inject(TourLogFacade);
  tours: Signal<TourResponseDto[]> = this.tourFacade.tours;

  ngOnInit(): void {
    this.tourFacade.loadTours();
  }

  openModal(tour: TourResponseDto) {
    this.modalTourId = tour.tourId;
    this.modalTourData = {
      title: tour.title,
      description: tour.description,
      route: tour.route,
    };
  }

  closeModal() {
    this.modalTourData = null;
    this.modalTourId = null;
  }

  saveTourChanges(updatedTourData: TourDto) {
    if (this.modalTourId) {
      this.tourFacade.updateTour(this.modalTourId, updatedTourData);
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
    }
    this.closeModal();
  }

  selectTour(tour: TourResponseDto | null) {
    this.tourFacade.selectTour(tour);
  }

  deleteData(toDeleteTour: TourResponseDto) {
    this.selectTour(null);
    this.tourFacade.deleteTour(toDeleteTour.tourId);
    this.closeModal();
  }
}
