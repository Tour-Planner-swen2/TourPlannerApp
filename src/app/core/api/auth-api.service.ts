import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly baseUrl = `${environment.apiUrl}/Auth`;

  constructor(private http: HttpClient) {}

  register(username: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/register`, { username, password }).pipe(
      map(() => true),
      catchError((error) => {
        console.error('Register error:', error);
        alert('Registration failed: Username may already exist or input is invalid');
        return of(false);
      }),
    );
  }
  login(username: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, { username, password }).pipe(
      tap((response) => {
        if (response && response.token) {
          localStorage.setItem('jwt_token', response.token);
        }
      }),
      map(() => true),
      catchError((error) => {
        console.error('Login error:', error);
        alert('Login failed: Invalid username or password');
        return of(false);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
  }
}
