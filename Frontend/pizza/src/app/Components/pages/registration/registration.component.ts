import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../Services/auth.service';
import { SessionService } from '../../../Services/session.service';
import { NotificationsService } from '../../../Services/notifications.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  registeringUser = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  };
  aszfElfogadva = false;

  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
    private notificationService: NotificationsService,
    private router: Router
  ) {}

  aszfChanged() {
    this.aszfElfogadva = !this.aszfElfogadva;
  }

  async registrationHandler() {
    // Validate ÁSZF acceptance
    if (!this.aszfElfogadva) {
      this.notificationService.error('El kell fogadnod az ÁSZF-et!');
      return;
    }

    // Validate all fields are filled
    if (
      !this.registeringUser.name ||
      !this.registeringUser.email ||
      !this.registeringUser.password ||
      !this.registeringUser.confirmPassword
    ) {
      this.notificationService.error('Nem adtál meg minden adatot!');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.registeringUser.email)) {
      this.notificationService.error('Hibás e-mail cím formátum!');
      return;
    }

    // Validate password match
    if (
      this.registeringUser.password !== this.registeringUser.confirmPassword
    ) {
      this.notificationService.error('A két jelszó nem egyezik!');
      return;
    }

    // Validate password strength (at least 8 characters, 1 uppercase, 1 lowercase, 1 number)
    const passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwdRegExp.test(this.registeringUser.password)) {
      this.notificationService.error(
        'A jelszónak legalább 8 karakter hosszúnak kell lennie, és tartalmaznia kell legalább 1 nagybetűt, 1 kisbetűt és 1 számot!'
      );
      return;
    }

    try {
      // Call registration endpoint
      const response = await this.authService.register(
        this.registeringUser.name,
        this.registeringUser.email,
        this.registeringUser.password,
        this.registeringUser.confirmPassword
      );

      // Registration successful
      this.notificationService.success('Sikeres regisztráció!');

      // Automatically log in the user
      try {
        const loginResponse = await this.authService.login(
          this.registeringUser.email,
          this.registeringUser.password
        );

        if (loginResponse.data && loginResponse.data.length > 0) {
          // Store user session
          this.sessionService.setUser(loginResponse.data[0]);
          this.notificationService.success('Sikeres bejelentkezés!');

          // Redirect to landing page and reload
          setTimeout(() => {
            this.router.navigate(['/']).then(() => {
              window.location.reload();
            });
          }, 500);
        }
      } catch (loginError: any) {
        this.notificationService.info(
          'Regisztráció sikeres! Kérlek jelentkezz be.'
        );
        this.router.navigate(['/bejelentkezes']);
      }
    } catch (error: any) {
      // Handle backend errors
      const errorMessage =
        error.response?.data?.error || 'Hiba történt a regisztráció során!';
      this.notificationService.error(errorMessage);
    }
  }
}
