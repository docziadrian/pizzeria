import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Table } from '../../../Interfaces/Table';
import { Reservation } from '../../../Interfaces/Reservation';
import { ReservationService } from '../../../Services/reservation.service';
import { SessionService } from '../../../Services/session.service';
import { NotificationsService } from '../../../Services/notifications.service';

@Component({
  selector: 'app-foglalas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './foglalas.component.html',
  styleUrl: './foglalas.component.scss',
})
export class FoglalasComponent implements OnInit {
  currentAsztal: Table | null = null;
  selectedDate: string = '';
  selectedTime: string = '';
  minDate: string = '';

  // Sikeres foglalás adatai és popup megjelenítése
  successfulReservation: Reservation | null = null;
  showSuccessPopup: boolean = false;

  constructor(
    private reservationService: ReservationService,
    private sessionService: SessionService,
    private notificationService: NotificationsService
  ) {}

  ngOnInit(): void {
    // Mai dátum beállítása
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    this.selectedDate = this.minDate;

    // Alapértelmezett időpont (18:00)
    this.selectedTime = '18:00';
  }

  handleASztalChange(asztal: Table) {
    this.currentAsztal = asztal;
  }

  asztalok = this.asztalFeltoltes();

  asztalFeltoltes(): Table[] {
    const asztalok: Table[] = [];
    for (let index = 0; index < 6; index++) {
      const ujAsztal: Table = {
        id: index + 1,
        number: index + 1,
        seats: 2,
        isAvailable: true,
      };
      asztalok.push(ujAsztal);
    }
    return asztalok;
  }

  async handleFoglalas() {
    if (!this.currentAsztal || !this.selectedDate || !this.selectedTime) {
      this.notificationService.error(
        'Kérlek válassz asztalt, dátumot és időpontot!'
      );
      return;
    }

    // Időpont validáció
    const [hours, minutes] = this.selectedTime.split(':').map(Number);
    if (hours < 18 || hours > 20 || (hours === 20 && minutes > 0)) {
      this.notificationService.error(
        'Kérjük válassz 18:00 és 20:00 közötti időpontot!'
      );
      return;
    }

    // Felhasználó lekérése
    const user = this.sessionService.getUser();
    if (!user) {
      this.notificationService.error('Kérlek jelentkezz be a foglaláshoz!');
      return;
    }

    try {
      // Ellenőrizzük, hogy az asztal elérhető-e az adott időpontban
      const isAvailable = await this.reservationService.checkAvailability(
        this.currentAsztal.id,
        this.selectedDate,
        this.selectedTime + ':00'
      );

      if (!isAvailable) {
        this.notificationService.error(
          'Ez az asztal már foglalt a megadott időpontban! Kérlek válassz másik időpontot vagy asztalt.'
        );
        return;
      }

      // Foglalás létrehozása
      const reservation: Omit<Reservation, 'id' | 'createdAt'> = {
        tableId: this.currentAsztal.id,
        tableNumber: this.currentAsztal.number,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        date: this.selectedDate,
        time: this.selectedTime + ':00',
        seats: this.currentAsztal.seats,
        price: 10000,
        status: 'sikeres',
      };

      await this.reservationService.createReservation(reservation);

      // Felhasználó foglalásainak újra lekérése és legújabb kiválasztása
      const userReservations =
        await this.reservationService.getUserReservations(user.id);

      // Legutóbbi foglalás kiválasztása (legnagyobb ID vagy legfrissebb createdAt)
      if (userReservations && userReservations.length > 0) {
        this.successfulReservation = userReservations.reduce(
          (latest, current) => {
            const latestId = latest.id || 0;
            const currentId = current.id || 0;
            return currentId > latestId ? current : latest;
          }
        );

        console.log('Legújabb foglalás:', this.successfulReservation);
        this.showSuccessPopup = true;

        // Értesítés
        this.notificationService.success('Foglalás sikeresen létrehozva!');
      } else {
        throw new Error('Nem sikerült lekérni a foglalást');
      }

      // Reset
      this.currentAsztal = null;
      this.selectedDate = this.minDate;
      this.selectedTime = '18:00';
    } catch (error: any) {
      console.error('Foglalási hiba:', error);
      this.notificationService.error(
        error.response?.data?.error || 'Hiba történt a foglalás során!'
      );
    }
  }

  // Popup bezárása
  closeSuccessPopup() {
    this.showSuccessPopup = false;
    this.successfulReservation = null;
  }

  // Foglalás letöltése TXT formátumban
  downloadReservation() {
    if (!this.successfulReservation) return;

    const reservation = this.successfulReservation;

    // Foglalás szöveg összeállítása
    const reservationText = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    FOGLALÁSI VISSZAIGAZOLÁS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Foglalási azonosító: #${reservation.id}
Dátum: ${this.formatDate(reservation.date)}
Időpont: ${reservation.time.substring(0, 5)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    ASZTAL ADATOK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Asztal száma: ${reservation.tableNumber}. asztal
Férőhelyek: ${reservation.seats} fő

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    VENDÉG ADATOK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Név: ${reservation.userName}
E-mail: ${reservation.userEmail}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    FIZETÉSI INFORMÁCIÓK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Foglalási díj: ${reservation.price.toLocaleString('hu-HU')} Ft
Státusz: ${this.getStatusText(reservation.status)}

Foglalás időpontja: ${
      reservation.createdAt
        ? new Date(reservation.createdAt).toLocaleString('hu-HU')
        : 'N/A'
    }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Kérjük őrizze meg ezt a visszaigazolást!

Étterem: Pizzéria
Cím: Budapest, Példa utca 1.
Telefon: +36 1 234 5678
E-mail: info@pizzeria.hu

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    // Blob létrehozása
    const blob = new Blob([reservationText], {
      type: 'text/plain;charset=utf-8',
    });

    // Link létrehozása és letöltés
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `foglalas_${reservation.id}_${reservation.date}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // URL felszabadítása
    URL.revokeObjectURL(link.href);

    this.notificationService.success('Foglalás letöltve!');
  }

  // Dátum formázása magyar formátumra
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // Státusz szöveg lekérése
  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      folyamatban: 'Folyamatban',
      sikeres: 'Sikeres',
      megszakitott: 'Megszakítva',
    };
    return statusMap[status] || status;
  }
}
