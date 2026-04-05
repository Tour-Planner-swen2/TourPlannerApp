import { Component, input, InputSignal } from '@angular/core';
import { formatDuration } from '../../../../shared/functions/formatter';
import { TourLog } from '../../../../core/models/tour-log.model';

@Component({
  selector: 'app-tour-log-item',
  imports: [],
  templateUrl: './tour-log-item.html',
  styleUrl: './tour-log-item.css',
})
export class TourLogItem {
  inputTourLog: InputSignal<TourLog | null> = input.required<TourLog | null>();
  protected readonly formatDuration = formatDuration;
}
