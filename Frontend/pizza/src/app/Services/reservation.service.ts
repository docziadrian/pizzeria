import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Reservation } from '../Interfaces/Reservation';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private baseUrl = 'http://localhost:3000';

  constructor(private apiService: ApiService) {}

  // Foglalás létrehozása
  async createReservation(
    reservation: Omit<Reservation, 'id' | 'createdAt'>
  ): Promise<Reservation> {
    try {
      const response = await this.apiService.post<Reservation>(
        `${this.baseUrl}/reservations`,
        reservation
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Asztal elérhetőségének ellenőrzése adott dátumra és időpontra
  async checkAvailability(
    tableId: number,
    date: string,
    time: string
  ): Promise<boolean> {
    try {
      const response = await this.apiService.getAll(
        `${this.baseUrl}/reservations/check/${tableId}/${date}/${time}`
      );
      return response.data.isAvailable;
    } catch (error) {
      console.error('Hiba az elérhetőség ellenőrzésekor:', error);
      throw error;
    }
  }

  // Felhasználó összes foglalásának lekérése
  async getUserReservations(userId: number): Promise<Reservation[]> {
    try {
      const response = await this.apiService.getAll(
        `${this.baseUrl}/reservations/user/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error('Hiba a foglalások lekérésekor:', error);
      throw error;
    }
  }

  // Foglalás státuszának frissítése
  async updateReservationStatus(
    id: number,
    status: 'folyamatban' | 'sikeres' | 'megszakitott'
  ): Promise<void> {
    try {
      await this.apiService.patch(`${this.baseUrl}/reservations`, id, {
        status,
      });
    } catch (error) {
      console.error('Hiba a státusz frissítésekor:', error);
      throw error;
    }
  }

  // Foglalás törlése
  async deleteReservation(id: number): Promise<void> {
    try {
      await this.apiService.delete(`${this.baseUrl}/reservations`, id);
    } catch (error) {
      console.error('Hiba a foglalás törlésekor:', error);
      throw error;
    }
  }

  // Összes foglalás lekérése (admin)
  async getAllReservations(): Promise<Reservation[]> {
    try {
      const response = await this.apiService.getAll(
        `${this.baseUrl}/reservations`
      );
      return response.data;
    } catch (error) {
      console.error('Hiba a foglalások lekérésekor:', error);
      throw error;
    }
  }
}
