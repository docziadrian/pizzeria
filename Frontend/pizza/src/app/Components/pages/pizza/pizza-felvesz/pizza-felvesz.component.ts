import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../../Services/api.service';
import { NotificationsService } from '../../../../Services/notifications.service';
import { Pizza } from '../../../../Interfaces/Pizza';

@Component({
  selector: 'app-pizza-felvesz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pizza-felvesz.component.html',
  styleUrl: './pizza-felvesz.component.scss',
})
export class PizzaFelveszComponent {
  // Új pizza
  newPizza = {
    nev: '',
    ar: 0,
    kepURL: '',
    hozzavalok: '',
  };

  // Kép feltöltés állapot
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isUploading = false;

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationsService,
    private router: Router
  ) {}

  // Fájl kiválasztás kezelése
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Ellenőrzés: csak képek
      if (!this.selectedFile.type.startsWith('image/')) {
        this.notificationService.error('Csak képfájlokat tölthetsz fel!');
        this.selectedFile = null;
        return;
      }

      // Ellenőrzés: max 10MB
      if (this.selectedFile.size > 10 * 1024 * 1024) {
        this.notificationService.error('A kép mérete maximum 10MB lehet!');
        this.selectedFile = null;
        return;
      }

      // Előnézet generálása
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // Kép feltöltése
  async uploadImage(): Promise<string> {
    if (!this.selectedFile) {
      throw new Error('Nincs kiválasztott fájl');
    }

    this.isUploading = true;

    try {
      // FormData készítése
      const formData = new FormData();
      formData.append('image', this.selectedFile);

      // Feltöltés ImgBB re
      const imgbbApiKey = '1167681f3465f44a5054da3cb1406b22'; //! ne hagyjam benne
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        this.isUploading = false;
        return data.data.url;
      } else {
        throw new Error('Hiba a kép feltöltése során');
      }
    } catch (error) {
      this.isUploading = false;
      throw error;
    }
  }

  // Kép törlése
  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.newPizza.kepURL = '';
  }

  // Pizza feltöltés kezelése
  async uploadPizzaHandler() {
    // Validáció
    if (!this.newPizza.nev || !this.newPizza.ar || !this.newPizza.hozzavalok) {
      this.notificationService.error('Kérlek töltsd ki az összes mezőt!');
      return;
    }

    // Validáció
    if (!this.selectedFile && !this.newPizza.kepURL) {
      this.notificationService.error('Kérlek válassz ki egy képet!');
      return;
    }

    // Validáció
    if (this.newPizza.ar <= 0) {
      this.notificationService.error('Az árnak pozitív számnak kell lennie!');
      return;
    }

    try {
      // Kép feltöltése, ha van kiválasz
      if (this.selectedFile && !this.newPizza.kepURL) {
        this.notificationService.info('Kép feltöltése folyamatban...');
        this.newPizza.kepURL = await this.uploadImage();
        this.notificationService.success('Kép sikeresen feltöltve!');
      }

      // Pizza adato
      const pizzaData = {
        nev: this.newPizza.nev,
        ar: this.newPizza.ar,
        kepURL: this.newPizza.kepURL,
        hozzavalok: this.newPizza.hozzavalok,
      };

      console.log('Sending pizza data:', pizzaData);

      // API hívás a pizza feltöltéséhez
      const response = await this.apiService.post<Pizza>(
        'http://localhost:3000/pizza',
        pizzaData
      );

      if (response.status === 200) {
        this.notificationService.success('Pizza sikeresen feltöltve!');

        // Form mezők visszaállítása
        this.newPizza = {
          nev: '',
          ar: 0,
          kepURL: '',
          hozzavalok: '',
        };
        this.removeImage();

        // Átirányítás a pizzák listájához
        setTimeout(() => {
          this.router.navigate(['/pizzak']);
        }, 1000);
      } else {
        this.notificationService.error('Hiba történt a feltöltés során!');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Hiba történt a pizza feltöltése során!';
      this.notificationService.error(errorMessage);
      console.error('Pizza feltöltési hiba:', error);
    }
  }

  // Mégse
  cancelHandler() {
    this.router.navigate(['/pizzak']);
  }
}
