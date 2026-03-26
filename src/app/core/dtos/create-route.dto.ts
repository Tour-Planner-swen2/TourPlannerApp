import { TravelType } from '../models/travel-types.model';

export interface CreateRouteDto {
  start: string;
  destination: string;
  traveltype: TravelType;
}
