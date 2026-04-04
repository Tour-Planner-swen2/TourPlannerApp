import { Component, input, InputSignal } from '@angular/core';
import { Tour } from '../../../../core/models/tour.model';
import { formatDuration } from '../../../../shared/functions/formatter';

@Component({
  selector: 'app-tour-list-item',
  imports: [],
  templateUrl: './tour-list-item.html',
  styleUrl: './tour-list-item.css',
})
export class TourListItem {
  inputTour: InputSignal<Tour> = input.required<Tour>();

  protected readonly formatDuration = formatDuration;
}
