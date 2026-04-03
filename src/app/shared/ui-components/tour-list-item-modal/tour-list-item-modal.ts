import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
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
    this.onSave.emit(this.editableTour);
  }

  protected readonly formatDuration = formatDuration;
}
