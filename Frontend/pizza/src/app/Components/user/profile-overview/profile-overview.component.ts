import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from '../../../Services/session.service';
import { ApiService } from '../../../Services/api.service';
import { NotificationsService } from '../../../Services/notifications.service';
import { User } from '../../../Interfaces/User';

@Component({
  selector: 'app-profile-overview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-overview.component.html',
  styleUrl: './profile-overview.component.scss',
})
export class ProfileOverviewComponent implements OnInit {
  user: User | null = null;
  isEditing = false;
  isChangingPassword = false;

  // ha szerkeszt, ezeket módosítja
  editData = {
    name: '',
    email: '',
  };

  // Jelszó változtatás adatok
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  constructor(
    private sessionService: SessionService,
    private apiService: ApiService,
    private notificationService: NotificationsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.sessionService.getUser();
    if (!this.user) {
      this.notificationService.error('Nincs bejelentkezve!');
      this.router.navigate(['/bejelentkezes']);
      return;
    }
    this.loadUserData();
  }

  loadUserData(): void {
    if (this.user) {
      this.editData = {
        name: this.user.name,
        email: this.user.email,
      };
    }
  }

  // Szerkesztés mód be
  startEditing(): void {
    this.isEditing = true;
    this.loadUserData();
  }

  // Szerkesztés mód ki
  cancelEditing(): void {
    this.isEditing = false;
    this.loadUserData();
  }

  // Profil adatok mentése
  async saveProfile(): Promise<void> {
    if (!this.user) return;

    // Validáció
    if (!this.editData.name || !this.editData.email) {
      this.notificationService.error('Minden mező kitöltése kötelező!');
      return;
    }

    // Email formátum ellenőrzése
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.editData.email)) {
      this.notificationService.error('Hibás e-mail cím formátum!');
      return;
    }

    try {
      const response = await this.apiService.patch<User>(
        'http://localhost:3000/users',
        this.user.id,
        {
          name: this.editData.name,
          email: this.editData.email,
        }
      );

      if (response.status === 200) {
        // Frissítjük a session-t
        //TODO: updateSession -> backend -> új token
        const updatedUser = {
          ...this.user,
          name: this.editData.name,
          email: this.editData.email,
        };
        this.sessionService.setUser(updatedUser);
        this.user = updatedUser;

        this.notificationService.success('Profil sikeresen frissítve!');
        this.isEditing = false;
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        'Hiba történt a profil frissítése során!';
      this.notificationService.error(errorMessage);
    }
  }

  // Jelszó változtatás mód bekapcsolása
  startChangingPassword(): void {
    this.isChangingPassword = true;
    this.passwordData = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
  }

  // Jelszó változtatás mód kikapcsolása
  cancelChangingPassword(): void {
    this.isChangingPassword = false;
    this.passwordData = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
  }

  // Jelszó megváltoztatása
  async changePassword(): Promise<void> {
    if (!this.user) return;

    // Validáció
    if (
      !this.passwordData.currentPassword ||
      !this.passwordData.newPassword ||
      !this.passwordData.confirmPassword
    ) {
      this.notificationService.error('Minden mező kitöltése kötelező!');
      return;
    }

    // Új jelszavak egyezésének ellenőrzése
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.notificationService.error('Az új jelszavak nem egyeznek!');
      return;
    }

    // Jelszó erősség ellenőrzése
    const passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwdRegExp.test(this.passwordData.newPassword)) {
      this.notificationService.error(
        'A jelszónak legalább 8 karakter hosszúnak kell lennie, és tartalmaznia kell legalább 1 nagybetűt, 1 kisbetűt és 1 számot!'
      );
      return;
    }

    try {
      const response = await this.apiService.patch<User>(
        'http://localhost:3000/users',
        this.user.id,
        {
          oldPassword: this.passwordData.currentPassword,
          password: this.passwordData.newPassword,
          confirm: this.passwordData.confirmPassword,
        }
      );

      if (response.status === 200) {
        this.notificationService.success('Jelszó sikeresen megváltoztatva!');
        this.cancelChangingPassword();
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        'Hiba történt a jelszó változtatása során!';
      this.notificationService.error(errorMessage);
    }
  }

  //! Fiók törlése
  async deleteAccount(): Promise<void> {
    if (!this.user) return;

    const confirmed = confirm(
      'Biztosan törölni szeretnéd a fiókodat? Ez a művelet nem visszavonható!'
    );

    if (!confirmed) return;

    try {
      await this.apiService.delete('http://localhost:3000/users', this.user.id);
      this.notificationService.success('Fiók sikeresen törölve!');
      this.sessionService.clearUser();
      setTimeout(() => {
        this.router.navigate(['/']).then(() => {
          window.location.reload();
        });
      }, 1000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || 'Hiba történt a fiók törlése során!';
      this.notificationService.error(errorMessage);
    }
  }

  // Kijelentkezés
  logout(): void {
    this.sessionService.clearUser();
    this.notificationService.success('Sikeres kijelentkezés!');
    setTimeout(() => {
      this.router.navigate(['/']).then(() => {
        window.location.reload();
      });
    }, 500);
  }
}
