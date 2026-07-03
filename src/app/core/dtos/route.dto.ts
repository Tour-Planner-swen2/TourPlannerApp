export interface RouteDto {
  start: string;
  destination: string;
  travelType: string;
  distance?: number;
  duration?: string;
}

export interface RouteResponseDto extends RouteDto {
  routeId: string;
}

