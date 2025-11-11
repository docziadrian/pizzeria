import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Review } from '../../../Interfaces/Review';
import { ReviewService } from '../../../Services/review.service';
import { SessionService } from '../../../Services/session.service';
import { NotificationsService } from '../../../Services/notifications.service';

interface OrderedPizza {
  id: number;
  name: string;
  image: string;
}

@Component({
  selector: 'app-ertekelesirasa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ertekelesirasa.component.html',
  styleUrl: './ertekelesirasa.component.scss',
})
export class ErtekelesirasaComponent implements OnInit {
  // Megrendelt pizzák listája
  orderedPizzas: OrderedPizza[] = [];

  // Kiválasztott pizza
  selectedPizza: OrderedPizza | null = null;

  // Értékelés adatok
  rating: number = 0;
  comment: string = '';

  // Felhasználó értékelései
  userReviews: Review[] = [];

  // Hover state a csillagokhoz
  hoverRating: number = 0;

  constructor(
    private reviewService: ReviewService,
    private sessionService: SessionService,
    private notificationService: NotificationsService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadUserData();
  }

  // Felhasználó adatainak betöltése
  async loadUserData(): Promise<void> {
    const user = this.sessionService.getUser();
    if (!user) {
      this.notificationService.error('Kérlek jelentkezz be az értékeléshez!');
      return;
    }

    try {
      // Megrendelt pizzák betöltése
      console.log('F:' + user.id);
      this.orderedPizzas = await this.reviewService.getUserOrderedPizzas(
        user.id
      );

      console.log(this.orderedPizzas);

      // Felhasználó értékeléseinek betöltése
      this.userReviews = await this.reviewService.getUserReviews(user.id);
    } catch (error) {
      console.error('Hiba az adatok betöltésekor:', error);
      this.notificationService.error('Hiba történt az adatok betöltésekor!');
    }
  }

  // Pizza kiválasztása
  selectPizza(pizza: OrderedPizza): void {
    this.selectedPizza = pizza;
    this.rating = 0;
    this.comment = '';
  }

  // Csillag beállítása
  setRating(stars: number): void {
    this.rating = stars;
  }

  // Hover rating beállítása
  setHoverRating(stars: number): void {
    this.hoverRating = stars;
  }

  // Hover rating törlése
  clearHoverRating(): void {
    this.hoverRating = 0;
  }

  // Értékelés elküldése
  async submitReview(): Promise<void> {
    if (!this.selectedPizza) {
      this.notificationService.error('Kérlek válassz egy pizzát!');
      return;
    }

    if (this.rating === 0) {
      this.notificationService.error('Kérlek adj csillagokat!');
      return;
    }

    if (!this.comment.trim()) {
      this.notificationService.error('Kérlek írj egy véleményt!');
      return;
    }

    const user = this.sessionService.getUser();
    if (!user) {
      this.notificationService.error('Kérlek jelentkezz be!');
      return;
    }

    try {
      const review: Omit<Review, 'id' | 'createdAt'> = {
        userId: user.id,
        userName: user.name,
        pizzaId: this.selectedPizza.id,
        pizzaName: this.selectedPizza.name,
        rating: this.rating,
        comment: this.comment.trim(),
      };

      await this.reviewService.createReview(review);

      this.notificationService.success('Értékelés sikeresen elküldve!');

      // Értékelések újratöltése
      await this.loadUserData();

      // Form reset
      this.selectedPizza = null;
      this.rating = 0;
      this.comment = '';
    } catch (error: any) {
      console.error('Hiba az értékelés küldésekor:', error);
      this.notificationService.error(
        error.response?.data?.error || 'Hiba történt az értékelés küldésekor!'
      );
    }
  }

  // Értékelés törlése
  async deleteReview(reviewId: number): Promise<void> {
    if (!confirm('Biztosan törölni szeretnéd ezt az értékelést?')) {
      return;
    }

    try {
      await this.reviewService.deleteReview(reviewId);
      this.notificationService.success('Értékelés sikeresen törölve!');
      await this.loadUserData();
    } catch (error) {
      console.error('Hiba az értékelés törlésekor:', error);
      this.notificationService.error('Hiba történt az értékelés törlésekor!');
    }
  }

  // Csillagok array generálása
  getStarsArray(count: number): number[] {
    return Array(count).fill(0);
  }

  // Üres csillagok array
  getEmptyStarsArray(count: number): number[] {
    return Array(5 - count).fill(0);
  }

  // Dátum formázása
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
