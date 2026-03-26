import { Route } from './route.model';

export interface Tour {
  tourId: string;
  createdBy: string;
  title: string;
  description: string;
  route: Route;
}
