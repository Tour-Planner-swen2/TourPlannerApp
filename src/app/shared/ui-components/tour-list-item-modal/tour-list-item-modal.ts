import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Tour } from '../../../core/models/tour.model';
import { TravelType } from '../../../core/models/travel-types.model';
import { NgClass } from '@angular/common';
import { initTooltips } from 'flowbite';

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
    console.log(this.editableTour);
    this.onCancel.emit();
  }

  clickDone() {
    this.onSave.emit(this.editableTour);
  }

  get formattedDuration(): string {
    if (!this.editableTour.route.duration) return '0:00';

    const hours: number = Math.floor(this.editableTour.route.duration / 60);
    const minutes: number = this.editableTour.route.duration % 60;

    if (hours > 0)
      return `${hours}:${minutes.toString().padStart(2, '0')}h`;
    return `${minutes.toString()}m`;
  }
}
