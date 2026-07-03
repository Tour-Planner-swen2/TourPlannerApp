import { Component, input, InputSignal } from '@angular/core';
import { TourResponseDto } from '../../../../core/dtos/tour.dto';
import { formatDuration, formatDistance } from '../../../../shared/functions/formatter'; // <-- formatDistance hinzufügen

@Component({
  selector: 'app-tour-list-item',
  imports: [],
  templateUrl: './tour-list-item.html',
  styleUrl: './tour-list-item.css',
})
export class TourListItem {
  inputTour: InputSignal<TourResponseDto> = input.required<TourResponseDto>();

  protected readonly formatDuration = formatDuration;
  protected readonly formatDistance = formatDistance;
}
