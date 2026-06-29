import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private mockUsers: User[] = [
    {
      userId: 'user-001',
      username: 'leopold',
      password: 'leopold123',
    },
    {
      userId: 'user-002',
      username: 'luka',
      password: 'luka123',
    },
    {
      userId: 'user-003',
      username: 'ana',
      password: 'ana123',
    },
  ];
  private readonly baseUrl = 'http://localhost:8000/Register';

  constructor(private http: HttpClient) {}

  realLogin(username: string, password: string): Observable<boolean> {
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

  login(username: string, password: string): Observable<User | null> {
    const user = this.mockUsers.find((u) => u.username === username && u.password === password);

    if (!user) {
      alert('Login failed: Invalid username or password');
    }

    return of(user ?? null);
  }

  register(username: string, password: string): Observable<User | null> {
    const exists = this.mockUsers.some((u) => u.username === username);
    if (exists) {
      alert('Username already exists.');
      return of(null);
    }

    if (username.length < 3 || password.length < 4) {
      alert('Username must be at least 3 characters and password at least 4 characters long.');
      return of(null);
    }

    const newUser: User = {
      userId: Math.random().toString(36).substring(2),
      username: username,
      password: password,
    };
    this.mockUsers.push(newUser);
    console.log('All users:', this.mockUsers);
    return of(newUser);
  }
}
