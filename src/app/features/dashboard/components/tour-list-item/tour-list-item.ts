import { Component, input, InputSignal, signal } from '@angular/core';
import { CustomButton } from '../../../../shared/ui-components/custom-button/custom-button';
import { Tour } from '../../../../core/models/tour.model';
import { TourListItemModal } from '../tour-list-item-modal/tour-list-item-modal';

@Component({
  selector: 'app-tour-list-item',
  imports: [CustomButton, TourListItemModal],
  templateUrl: './tour-list-item.html',
  styleUrl: './tour-list-item.css',
})
export class TourListItem {
  inputTour: InputSignal<Tour> = input.required<Tour>();
  tour!: Tour;
  ngOnInit() {
    this.tour = this.inputTour();
  }

  isModalOpen = signal(false);

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  saveTourChanges(updatedTour: Tour) {
    console.log(updatedTour);
    this.tour = updatedTour;
    this.closeModal();
  }
}
