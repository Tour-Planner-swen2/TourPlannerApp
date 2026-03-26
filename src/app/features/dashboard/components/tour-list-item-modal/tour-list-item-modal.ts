import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Tour } from '../../../../core/models/tour.model';

@Component({
  selector: 'app-tour-list-item-modal',
  imports: [FormsModule],
  templateUrl: './tour-list-item-modal.html',
  styleUrl: './tour-list-item-modal.css',
})
export class TourListItemModal {
  tour: InputSignal<Tour> = input.required<Tour>();

  onCancel: OutputEmitterRef<void> = output<void>();
  onSave: OutputEmitterRef<Tour> = output<Tour>();

  editableTour!: Tour;

  ngOnInit() {
    this.editableTour = structuredClone(this.tour());
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
