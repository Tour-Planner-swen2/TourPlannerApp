import {
  Component,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Tour } from '../../../core/models/tour.model';
import { TravelType } from '../../../core/models/travel-types.model';
import { NgClass } from '@angular/common';
import { initTooltips } from 'flowbite';
import { formatDuration } from '../../functions/formatter';

@Component({
  selector: 'app-tour-list-item-modal',
  imports: [FormsModule, NgClass],
  templateUrl: './tour-list-item-modal.html',
  styleUrl: './tour-list-item-modal.css',
})
export class TourListItemModal {
  tour: InputSignal<Tour> = input.required<Tour>();
  onCancel: OutputEmitterRef<void> = output<void>();
  onSave: OutputEmitterRef<Tour> = output<Tour>();
  onDelete: OutputEmitterRef<Tour> = output<Tour>();

  travelTypeOptions: TravelType[] = [
    TravelType.Bike,
    TravelType.Hike,
    TravelType.Run,
    TravelType.Car,
  ];

  selectTravelType(travelType: TravelType) {
    this.editableTour.route.traveltype = travelType;
  }

  editableTour!: Tour;

  ngOnInit() {
    this.editableTour = structuredClone(this.tour());
  }

  ngAfterViewInit(): void {
    initTooltips();
  }

  clickCancel() {
    this.onCancel.emit();
  }

  clickDelete() {
    this.onDelete.emit(this.editableTour);
  }

  clickDone() {
    if (this.DataCorrect()) this.onSave.emit(this.editableTour);
  }

  /*
  tourId: string;
  createdBy: string;
  title: string;
  description: string;
  route: {
    routeId: string;
    start: string;
    destination: string;
    traveltype: TravelType;
    distance: number;
    duration: number;
    information: string;};*/

  DataCorrect(): boolean {
    if (!this.editableTour.title || this.editableTour.title.trim() === '') {
      alert('Title cannot be empty!');
      return false;
    }

    if (this.editableTour.title.length > 100) {
      alert('Title is too long! Max length is 100 characters.');
      return false;
    }

    if (this.editableTour.description && this.editableTour.description.length > 1000) {
      alert('Description is too long! Max length is 1000 characters.');
      return false;
    }

    if (!this.editableTour.route.start || this.editableTour.route.start.trim() === '') {
      alert('Start location cannot be empty!');
      return false;
    }

    if (!this.editableTour.route.destination || this.editableTour.route.destination.trim() === '') {
      alert('Destination cannot be empty!');
      return false;
    }

    if (this.editableTour.route.start.trim() === this.editableTour.route.destination.trim()) {
      alert('Start and Destination cannot be the same!');
      return false;
    }

    if (!this.editableTour.route.traveltype) {
      alert('Please select a valid travel type!');
      return false;
    }

    if (this.editableTour.route.information && this.editableTour.route.information.length > 500) {
      alert('Route information is too long! Max length is 500 characters.');
      return false;
    }
    return true;
  }

  protected readonly formatDuration = formatDuration;
}
