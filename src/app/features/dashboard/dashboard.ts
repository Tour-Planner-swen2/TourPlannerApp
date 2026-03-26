import { Component, signal } from '@angular/core';
import { CustomButton } from '../../shared/ui-components/custom-button/custom-button';
import { Route } from '../../core/models/route.model';
import { TravelType } from '../../core/models/travel-types.model';
import { Tour } from '../../core/models/tour.model';
import { TourDetails } from './components/tour-details/tour-details';

@Component({
  selector: 'app-dashboard',
  imports: [CustomButton, CustomButton, TourDetails],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  isModalOpen = signal(false);

  dummyRoute: Route = {
    routeId: 'route-1234-uuid',
    start: 'Vienna',
    destination: 'Salzburg',
    traveltype: TravelType.Car,
    distance: 295,
    duration: 180,
    information: 'A beautiful and scenic drive along the A1 autobahn.',
  };

  dummyTour: Tour = {
    tourId: 'tour-9876-uuid',
    createdBy: 'user-001',
    title: 'Weekend Trip to Salzburg',
    description: "Visiting the mountains and Mozart's birthplace.",
    route: this.dummyRoute,
  };

  openModal() {
    this.isModalOpen.set(true);
  }

  // Bonus: Method to close it
  closeModal() {
    this.isModalOpen.set(false);
  }

  saveTourChanges(updatedTour: Tour) {
    console.log(updatedTour);
    this.dummyTour = updatedTour;
    this.closeModal();
  }
}
