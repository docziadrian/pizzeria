import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../Services/api.service';
import { Orders } from '../../../Interfaces/Orders';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  maiRendelesek: number = 0;
  aktivFelhasznalok: number = 0;
  maiBevetel: number = 0;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  navigateTo(link: string) {
    window.location.href = link;
  }

  async loadStatistics(): Promise<void> {
    try {
      // Mai dátum formázása (YYYY-MM-DD)
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const formattedDate = `${yyyy}-${mm}-${dd}`;

      // Rendelések betöltése
      const rendelesekResponse = await this.apiService.getAll(
        'http://localhost:3000/orders'
      );
      const rendelesek = rendelesekResponse.data;

      // Mai rendelések szűrése
      const maiRendelesekData = rendelesek.filter((rendeles: Orders) =>
        rendeles.datum?.startsWith(formattedDate)
      );

      console.log(maiRendelesekData);

      this.maiRendelesek = maiRendelesekData.length;

      // Mai bevétel számítása
      this.maiBevetel = maiRendelesekData.reduce(
        (sum: number, rendeles: any) => sum + (rendeles.totalPrice || 0),
        0
      );

      // Aktív felhasználók betöltése
      const usersResponse = await this.apiService.getAll(
        'http://localhost:3000/users'
      );
      this.aktivFelhasznalok = usersResponse.data.length;
    } catch (error) {
      console.error('Hiba a statisztikák betöltése során:', error);
    }
  }
}
