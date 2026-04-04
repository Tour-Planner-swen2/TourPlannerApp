import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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

    login(username: string, password: string): Observable<User | null> {
        const user = this.mockUsers.find(
            u => u.username === username && u.password === password
        );

        if (!user) {
          alert('Login failed: Invalid username or password');
        }
        
        return of(user ?? null);
    }
    
    register(username: string, password: string): Observable<User | null> {
        const exists = this.mockUsers.some(u => u.username === username);
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
        console.log('All users:', this.mockUsers); //debug log zum verifizieren
        return of(newUser);
        }
  }