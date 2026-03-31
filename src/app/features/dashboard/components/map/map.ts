import { Component, effect, inject } from '@angular/core';
import { TourFacade } from '../../../../core/facades/tour.facade';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map {
  private tourFacade: TourFacade = inject(TourFacade);
  activeTour = this.tourFacade.selectedTour;

  mapUpdater= effect(() => {
    if(this.activeTour()){
      //Leaflet API
    }
  });
}
