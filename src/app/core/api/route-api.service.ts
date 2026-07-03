import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { RouteDto, RouteResponseDto } from '../dtos/route.dto';

@Injectable({
  providedIn: 'root',
})
export class RouteApiService {
  private apiUrl = `${environment.apiUrl}/Route`;

  constructor(private http: HttpClient) {}

  getAllRoutes(): Observable<RouteResponseDto[]> {
    return this.http.get<RouteResponseDto[]>(this.apiUrl);
  }

  getRouteById(id: string): Observable<RouteResponseDto> {
    return this.http.get<RouteResponseDto>(`${this.apiUrl}/${id}`);
  }

  createRoute(routeDto: RouteDto): Observable<RouteResponseDto> {
    console.log(routeDto);
    const createdRoute: Observable<RouteResponseDto> = this.http.post<RouteResponseDto>(this.apiUrl, routeDto);
    console.log(createdRoute);
    return createdRoute;
  }

  updateRoute(id: string, routeDto: RouteDto): Observable<RouteResponseDto> {
    return this.http.patch<RouteResponseDto>(`${this.apiUrl}/${id}`, routeDto);
  }

  deleteRoute(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

