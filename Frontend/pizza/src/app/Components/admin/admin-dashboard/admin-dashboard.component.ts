import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent {
  adminPanel = [
    //TODO: Ikonokat
    {
      name: 'Felhasználók kezelése',
      link: '/admin/felhasznalo-kezeles',
      iconUrl: '',
    },
    {
      name: 'Rendelések kezelése',
      link: '/admin/rendelesek-kezelese',
      iconUrl: '',
    },
    { name: 'Statisztikák', link: '/admin/statisztikak', iconUrl: '' },
    { name: 'Pizza felvétele', link: '/pizzak/felvesz', iconUrl: '' },
  ];

  navigateTo(link: string) {
    window.location.href = link;
  }

  getDescription(panelName: string): string {
    const descriptions: { [key: string]: string } = {
      'Pizzák kezelése': 'Pizzák hozzáadása, szerkesztése és törlése',
      Rendelések: 'Rendelések megtekintése és kezelése',
      Felhasználók: 'Felhasználói fiókok adminisztrációja',
      Statisztikák: 'Értékesítési adatok és kimutatások',
    };
    return descriptions[panelName] || 'Kezelőfelület';
  }
}
