import { Component, computed, inject, input, InputSignal, Signal, signal } from '@angular/core';
import { Tour } from '../../../../core/models/tour.model';
import { formatDuration } from '../../../../shared/functions/formatter';
import { TourLogFacade } from '../../../../core/facades/tourlog.facade';
import { TourLog } from '../../../../core/models/tour-log.model';
import { Friendliness } from '../../../../core/models/friendliness.modal';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-tour-list-item',
  imports: [],
  templateUrl: './tour-list-item.html',
  styleUrl: './tour-list-item.css',
})
export class TourListItem {
  inputTour: InputSignal<Tour> = input.required<Tour>();
  tour!: Tour;
  ngOnInit() {
    this.tour = this.inputTour();
  }

  protected readonly formatDuration = formatDuration;
}
