import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email = '';
  username = '';
  password = '';
  message = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router, private location: Location) {
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

  onRegister() {
    this.isLoading = true;
    this.authService.register(this.email, this.password, this.username).subscribe({
      next: () => {
        // After sign-up, log the user in automatically
        this.authService.login(this.email, this.password).subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(['/dashboard']);
          },
          error: () => {
            this.isLoading = false;
            this.message = 'Registration successful! Please check your email to confirm your account, then log in.';
          }
        });
      },
      error: (err: any) => {
        this.isLoading = false;
        this.message = err.message || 'Registration failed.';
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
