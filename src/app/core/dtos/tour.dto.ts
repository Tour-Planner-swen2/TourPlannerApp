import { RouteDto, RouteResponseDto } from './route.dto';

export interface TourDto {
  tourId?: string;
  title: string;
  description: string;
  route: RouteDto;
}

export interface TourResponseDto extends TourDto {
  tourId: string;
  createdBy: string;
  route: RouteResponseDto;
}

