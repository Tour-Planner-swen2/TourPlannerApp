import { Component } from '@angular/core';
import { Tour } from '../../../../core/models/tour.model';
import { TravelType } from '../../../../core/models/travel-types.model';
import { TourListItem } from '../tour-list-item/tour-list-item';

@Component({
  selector: 'app-tour-list',
  imports: [TourListItem],
  templateUrl: './tour-list.html',
  styleUrl: './tour-list.css',
})
export class TourList {
  tours: Tour[] = [
    {
      tourId: 'tour-1111-uuid',
      createdBy: 'user-001',
      title: 'Weekend Trip to Salzburg',
      description: "Visiting the mountains and Mozart's birthplace.",
      route: {
        routeId: 'route-1111-uuid',
        start: 'Vienna',
        destination: 'Salzburg',
        traveltype: TravelType.Car,
        distance: 295,
        duration: 180,
        information: 'A beautiful and scenic drive along the A1 autobahn.',
      },
    },
    {
      tourId: 'tour-2222-uuid',
      createdBy: 'user-002',
      title: 'Danube Twin City Ride',
      description: 'A flat, relaxing cycling trip along the Danube river crossing the border.',
      route: {
        routeId: 'route-2222-uuid',
        start: 'Vienna',
        destination: 'Bratislava',
        traveltype: TravelType.Bike,
        distance: 65,
        duration: 200,
        information: 'Well-paved bike paths following the Donauradweg strictly.',
      },
    },
    {
      tourId: 'tour-3333-uuid',
      createdBy: 'user-001',
      title: 'Tyrolean Alps Hike',
      description: 'Challenging but rewarding day hike with panoramic mountain views.',
      route: {
        routeId: 'route-3333-uuid',
        start: 'Innsbruck',
        destination: 'Seefeld',
        traveltype: TravelType.Foot,
        distance: 22,
        duration: 360, // 6 hours
        information: 'Steep inclines and rocky paths. Hiking boots required.',
      },
    },
    {
      tourId: 'tour-4444-uuid',
      createdBy: 'user-003',
      title: 'Southern Styria Getaway',
      description: 'Exploring the famous Austrian wine region and the Graz clock tower.',
      route: {
        routeId: 'route-4444-uuid',
        start: 'Vienna',
        destination: 'Graz',
        traveltype: TravelType.Car,
        distance: 200,
        duration: 150,
        information: 'Smooth drive down the A2 highway with plenty of rest stops.',
      },
    },
    {
      tourId: 'tour-5555-uuid',
      createdBy: 'user-002',
      title: 'Salzkammergut Lake Tour',
      description: 'Visiting the picturesque lake district and historic salt mines.',
      route: {
        routeId: 'route-5555-uuid',
        start: 'Salzburg',
        destination: 'Hallstatt',
        traveltype: TravelType.Bike,
        distance: 72,
        duration: 250,
        information: 'Hilly terrain with stunning lake-side views. E-bike recommended.',
      },
    },
  ];
}
