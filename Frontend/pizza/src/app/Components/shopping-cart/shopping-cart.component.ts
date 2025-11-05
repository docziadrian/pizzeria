import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from '../../Services/localstorage.service';
import { LocalStorageItem } from '../../Interfaces/LocalStorageItem';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form/form.component';
import { OrderService } from '../../Services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, FormComponent],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss',
})
export class ShoppingCartComponent implements OnInit {
  constructor(
    private localStorageService: LocalstorageService,
    private orderService: OrderService,
    private router: Router
  ) {}

  //TODO: alertek helyett notification

  allPizzasInCart: LocalStorageItem[] = [];

  ngOnInit(): void {
    this.loadCart();
    this.localStorageService.pizzas$.subscribe(() => {
      this.loadCart();
    });
  }

  private loadCart(): void {
    this.allPizzasInCart = this.localStorageService.getAllItems();
  }

  increaseQuantity(id: number): void {
    const item = this.allPizzasInCart.find((i) => i.id === id);
    if (item) {
      this.localStorageService.updateItem(id, {
        ...item,
        amount: item.amount + 1,
      });
      this.loadCart();
    }
  }

  decreaseQuantity(id: number): void {
    const item = this.allPizzasInCart.find((i) => i.id === id);
    if (item && item.amount > 1) {
      this.localStorageService.updateItem(id, {
        ...item,
        amount: item.amount - 1,
      });
      this.loadCart();
    }
  }

  deleteItem(id: number): void {
    if (confirm('Biztosan törölni szeretnéd ezt a tételt?')) {
      this.localStorageService.deleteItem(id);
      this.loadCart();
    }
  }

  clearCart(): void {
    if (confirm('Biztosan ki szeretnéd üríteni a kosarat?')) {
      this.localStorageService.clearAll();
      this.loadCart();
    }
  }

  getTotalItems(): number {
    return this.allPizzasInCart.reduce((sum, item) => sum + item.amount, 0);
  }

  getTotalPrice(): number {
    return this.allPizzasInCart.reduce(
      (sum, item) => sum + item.price * item.amount,
      0
    );
  }

  // Rendelés leadása
  async submitOrder(): Promise<void> {
    if (this.allPizzasInCart.length === 0) {
      alert('A kosár üres!');
      return;
    }

    if (!confirm('Biztosan le szeretnéd adni a rendelést?')) {
      return;
    }

    try {
      await this.orderService.createOrder(this.allPizzasInCart);
      alert('Rendelés sikeresen leadva!');
      this.localStorageService.clearAll();
      this.router.navigate(['/pizzak']);
    } catch (error) {
      console.error('Hiba a rendelés leadása során:', error);
      alert('Hiba történt a rendelés leadása során!');
    }
  }
}
