import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthFacade } from '../../../core/facades/auth.facade';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authFacade = inject(AuthFacade);

  username = '';
  password = '';

  onLogin(): void {
    this.authFacade.login(this.username, this.password);
  }
}