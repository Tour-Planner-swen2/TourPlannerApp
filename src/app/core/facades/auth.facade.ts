import { Injectable, inject, signal } from '@angular/core';
import { AuthApiService } from '../api/auth-api.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private authApi = inject(AuthApiService);
  private router = inject(Router);
  private token = signal<string | null>(null);

  isLoggedIn(): boolean {
    return this.token() !== null;
  }

  login(username: string, password: string): void {
    this.authApi.login(username, password).subscribe(user => {
      if (user) {
        this.token.set(Math.random().toString(36).substring(2));
        console.log('Login successful, token set:', this.token());
        this.router.navigate(['/dashboard']);
      }
    });
  }

  logout(): void {
    this.token.set(null);
    this.router.navigate(['/login']);
  }

  register(username: string, password: string): void {
    this.authApi.register(username, password).subscribe(user => {
      if (user) {
        this.token.set(Math.random().toString(36).substring(2));
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
