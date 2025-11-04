import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SessionService } from '../../../Services/session.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  constructor(private sessionService: SessionService) {}
  @Input() title = '';

  NoUserNavItems = [
    { name: 'Főoldal', link: '/' },
    { name: 'Regisztráció', link: '/regisztracio' },
    { name: 'Bejelentkezés', link: '/bejelentkezes' },
  ];

  UserNavItems = [
    { name: 'Főoldal', link: '/' },
    { name: 'Pizzák', link: '/pizzak' },
    { name: 'Profil', link: '/fiokom' },
  ];

  navbarItems: any[] = [];
  isUserLoggedIn = false;

  PlusMenuForAdmins = [
    { name: 'Főoldal', link: '/' },
    { name: 'Pizzák', link: '/pizzak' },
    { name: 'Pizza felvesz', link: '/pizzak/felvesz' },
    { name: 'Profil', link: '/fiokom' },
  ];

  ngOnInit(): void {
    const user = this.sessionService.getUser();
    let navItems = [];

    if (user) {
      this.isUserLoggedIn = true;
      // User be van lépve
      navItems = [...this.UserNavItems];

      // Ha admin, akkor ...
      if (user.role.role === 'admin') {
        navItems = [navItems, ...this.PlusMenuForAdmins];
      }
    } else {
      // NINCS BELÉPVE A USER
      navItems = [...this.NoUserNavItems];
    }

    this.navbarItems = navItems;
  }

  kijelentkezes() {
    this.sessionService.clearUser();
    window.location.reload();
  }
}
