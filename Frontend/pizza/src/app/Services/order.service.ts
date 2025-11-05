import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Orders } from '../Interfaces/Orders';
import { SessionService } from './session.service';
import { LocalStorageItem } from '../Interfaces/LocalStorageItem';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(
    private api: ApiService,
    private sessionService: SessionService
  ) {}

  // Rendelés létrehozása
  async createOrder(pizzas: LocalStorageItem[]): Promise<void> {
    const user = this.sessionService.getUser();
    if (!user) {
      throw new Error('Nincs bejelentkezve felhasználó!');
    }

    const orderPromises = pizzas.map((pizza) => {
      const orderData = {
        userID: user.id,
        pizzaID: pizza.id,
        quantity: pizza.amount,
        totalPrice: pizza.price * pizza.amount,
        datum: new Date().toISOString().split('T')[0], //! YYYY-MM-DD formátum
        status: 'folyamatban',
      };

      return this.api.post(this.api.baseURL + 'orders', orderData);
    });

    await Promise.all(orderPromises);
  }

  // Összes rendelés lekérése
  async getAllOrders(): Promise<Orders[]> {
    try {
      const response = await this.api.getAll(this.api.baseURL + 'orders');
      return response.data;
    } catch (error) {
      console.error('Hiba a rendelések betöltése során:', error);
      throw error;
    }
  }

  // Rendelés frissítése
  async updateOrder(id: number, data: Partial<Orders>): Promise<void> {
    await this.api.patch(this.api.baseURL + 'orders', id, data);
  }

  // Rendelés törlése
  async deleteOrder(id: number): Promise<void> {
    await this.api.delete(this.api.baseURL + 'orders', id);
  }

  // Felhasználó rendeléseinek lekérése
  async getUserOrders(userId: number): Promise<Orders[]> {
    try {
      const response = await this.api.getAll(
        this.api.baseURL + `orders/userID/eq/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error('Hiba a felhasználó rendeléseinek betöltése során:', error);
      throw error;
    }
  }
}
