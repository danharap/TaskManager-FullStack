import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  message = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {
    // Show spinner during route changes (login <-> register)
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.isLoading = false;
      }
    });
  }

  onLogin() {
    this.isLoading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.isLoading = false;
        this.message = err.error?.Message || 'Login failed.';
      }
    });
  }
}