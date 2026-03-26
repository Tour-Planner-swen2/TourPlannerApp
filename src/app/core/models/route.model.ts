import { TravelType } from './travel-types.model';

export interface Route {
  routeId: string;
  start: string;
  destination: string;
  traveltype: TravelType;
  distance: number;
  duration: number;
  information: string;
}
