import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SessionService } from '../../../Services/session.service';
import { LocalstorageService } from '../../../Services/localstorage.service';
import { KosarService } from '../../../Services/kosar.service';

interface InfoItem {
  icon: string;
  title: string;
  description: string;
  link: string;
}
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  constructor(
    private sessionService: SessionService,
    private localStorageService: LocalstorageService,
    private kosarService: KosarService
  ) {}
  @Input() title = '';

  isHelpOpen = false;

  changeHelpOpen() {
    this.isHelpOpen = !this.isHelpOpen;
  }

  NoUserNavItems = [
    { name: 'Főoldal', link: '/' },
    { name: 'Regisztráció', link: '/regisztracio' },
    { name: 'Bejelentkezés', link: '/bejelentkezes' },
  ];

  UserNavItems = [
    { name: 'Főoldal', link: '/' },
    { name: 'Étlap', link: '/etlap' },
    { name: 'Profil', link: '/fiokom' },
    { name: 'Foglalás', link: '/foglalas' },
    { name: 'Értékelés', link: '/ertekeles' },
  ];

  navbarItems: any[] = [];
  isUserLoggedIn = false;

  PlusMenuForAdmins = [
    { name: 'Főoldal', link: '/' },
    { name: 'Étlap', link: '/etlap' },
    { name: 'Pizzák', link: '/pizzak' },
    { name: 'Pizza felvesz', link: '/pizzak/felvesz' },
    { name: 'Profil', link: '/fiokom' },
    { name: 'Foglalás', link: '/foglalas' },
    { name: 'Értékelés', link: '/ertekeles' },
  ];

  cartAmount: number = 0;

  ngOnInit(): void {
    const user = this.sessionService.getUser();
    let navItems = [];

    this.cartAmount = this.kosarService.getKosarCount();

    if (user) {
      this.isUserLoggedIn = true;
      navItems = [...this.UserNavItems];

      if (user.role.role === 'admin') {
        navItems = [...this.PlusMenuForAdmins];
      }
    } else {
      navItems = [...this.NoUserNavItems];
    }

    this.navbarItems = navItems;
  }

  kijelentkezes() {
    this.sessionService.clearUser();
    window.location.reload();
  }

  asideItems = [
    { name: 'Főoldal', link: '/' },
    { name: 'Pizzák', link: '/pizzak' },
    { name: 'Kosár', link: '/kosar' },
    { name: 'Profil', link: '/profil' },
  ];

  infoItems: InfoItem[] = [
    {
      icon: 'truck',
      title: 'Ingyenes a szállítás',
      description: '10 000 Ft felett',
      link: '/szallitas',
    },
    {
      icon: 'shield',
      title: 'Szállítási garancia',
      description: 'Mindig megérkezik rendben',
      link: '/szallitas',
    },
    {
      icon: 'help',
      title: 'Segítség kérése',
      description: 'Kérdésed van? Keress minket',
      link: '/kapcsolat',
    },
    {
      icon: 'smartphone',
      title: 'Vásárlás mobilon',
      description: 'Töltsd le az appot',
      link: '/app',
    },
  ];
}
