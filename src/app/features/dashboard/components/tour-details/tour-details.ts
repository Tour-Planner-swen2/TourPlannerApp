import { Component, inject } from '@angular/core';
import { TourFacade } from '../../../../core/facades/tour.facade';

@Component({
  selector: 'app-tour-details',
  imports: [],
  templateUrl: './tour-details.html',
  styleUrl: './tour-details.css',
})
export class TourDetails {
  private tourFacade: TourFacade = inject(TourFacade);

  activeTour = this.tourFacade.selectedTour;
}
