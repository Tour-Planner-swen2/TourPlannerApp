import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { Tour } from '../../../../core/models/tour.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tour-details',
  imports: [FormsModule],
  templateUrl: './tour-details.html',
  styleUrl: './tour-details.css',
})
export class TourDetails {
  tour: InputSignal<Tour> = input.required<Tour>();

  onCancel: OutputEmitterRef<void> = output<void>();
  onSave: OutputEmitterRef<Tour> = output<Tour>();

  editableTour!: Tour;

  ngOnInit() {
    this.editableTour = { ...this.tour() };
  }

  clickCancel() {
    console.log('Cancel clicked, reverting changes.');
    console.log(this.editableTour);
    this.onCancel.emit();
  }

  clickDone() {
    console.log('Done clicked, implementing changes.');
    console.log(this.editableTour);
    this.onSave.emit(this.editableTour);
  }
}
