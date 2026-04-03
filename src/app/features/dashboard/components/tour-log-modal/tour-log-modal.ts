import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { initTooltips } from 'flowbite';
import { TourLog } from '../../../../core/models/tour-log.model';
import { formatDuration } from '../../../../shared/functions/formatter';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-tour-log-modal',
  imports: [ReactiveFormsModule, FormsModule, NgClass],
  templateUrl: './tour-log-modal.html',
  styleUrl: './tour-log-modal.css',
})
export class TourLogModal {
  tourLog: InputSignal<TourLog> = input.required<TourLog>();
  onCancel: OutputEmitterRef<void> = output<void>();
  onSave: OutputEmitterRef<TourLog> = output<TourLog>();
  onDelete: OutputEmitterRef<TourLog> = output<TourLog>();

  ratingOptions: number[] = [1, 2, 3, 4, 5];

  editableTourLog!: TourLog;

  selectRating(rating: number) {
    this.editableTourLog.rating = rating;
  }

  ngOnInit() {
    this.editableTourLog = structuredClone(this.tourLog());
  }

  ngAfterViewInit(): void {
    initTooltips();
  }

  clickCancel() {
    this.onCancel.emit();
  }

  clickDelete() {
    this.onDelete.emit(this.editableTourLog);
  }

  clickDone() {
    if (this.DataCorrect())
      this.onSave.emit(this.editableTourLog);
  }

  /*  date: string;
  comment: string;
  difficulty: number;
  distance: number;
  duration: number;
  rating: number;*/

  DataCorrect(): boolean{

    const regex = /^(0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

    if (!regex.test(this.editableTourLog.date)) {
      alert('Date was wrong! Please use the DD-MM-YYYY format.');
      return false;
    }

    const [day, month, year] = this.editableTourLog.date.split('-').map(Number);

    const date = new Date(year, month - 1, day);

    if (date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year) {
      alert('Date was wrong! Please use the DD-MM-YYYY format.');
      return false;
    }
    if (this.editableTourLog.comment.length > 500) {
      alert('Comment is too long! Max length is 500 characters.');
      return false;
    }
    if (this.editableTourLog.difficulty < 1 || this.editableTourLog.difficulty > 10) {
      alert('Difficulty must be between 1 and 10!');
      return false;
    }
    if (this.editableTourLog.distance > 1 || this.editableTourLog.difficulty < 40_000) {
      alert('Tour needs a distance between 1 and 40.000 km!');
      return false;
    }
    if(this.editableTourLog.rating < 1 || this.editableTourLog.rating > 5){
      alert("Rating must be between 1 and 5!");
      return false;
    }
    return true;
  }

  protected readonly formatDuration = formatDuration;
}
