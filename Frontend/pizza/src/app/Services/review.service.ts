import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Review } from '../Interfaces/Review';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private baseUrl = 'http://localhost:3000';

  constructor(private apiService: ApiService) {}

  // Értékelés létrehozása
  async createReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<any> {
    try {
      const response = await this.apiService.post<any>(
        `${this.baseUrl}/reviews`,
        review
      );
      return response.data;
    } catch (error) {
      console.error('Hiba az értékelés létrehozásakor:', error);
      throw error;
    }
  }

  // Felhasználó értékelései
  async getUserReviews(userId: number): Promise<Review[]> {
    try {
      const response = await this.apiService.getAll(
        `${this.baseUrl}/reviews/user/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error('Hiba az értékelések lekérésekor:', error);
      throw error;
    }
  }

  // Pizza értékelései
  async getPizzaReviews(pizzaId: number): Promise<Review[]> {
    try {
      const response = await this.apiService.getAll(
        `${this.baseUrl}/reviews/pizza/${pizzaId}`
      );
      return response.data;
    } catch (error) {
      console.error('Hiba az értékelések lekérésekor:', error);
      throw error;
    }
  }

  // Összes értékelés
  async getAllReviews(): Promise<Review[]> {
    try {
      const response = await this.apiService.getAll(`${this.baseUrl}/reviews`);
      return response.data;
    } catch (error) {
      console.error('Hiba az értékelések lekérésekor:', error);
      throw error;
    }
  }

  // Értékelés törlése
  async deleteReview(id: number): Promise<void> {
    try {
      await this.apiService.delete(`${this.baseUrl}/reviews`, id);
    } catch (error) {
      console.error('Hiba az értékelés törlésekor:', error);
      throw error;
    }
  }

  // Felhasználó megrendelt pizzái (rendelésekből)
  async getUserOrderedPizzas(userId: number): Promise<any[]> {
    try {
      const response = await this.apiService.getAll(
        `${this.baseUrl}/orders/user/${userId}/pizzas`
      );
      return response.data;
    } catch (error) {
      console.error('Hiba a pizzák lekérésekor:', error);
      throw error;
    }
  }
}
