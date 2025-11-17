import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { KosarService } from '../../Services/kosar.service';
import { KosarItem } from '../../Interfaces/Extras';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss',
})
export class ShoppingCartComponent implements OnInit {
  kosarItems: KosarItem[] = [];
  editingItemId: string | null = null;

  constructor(
    private kosarService: KosarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadKosar();
  }

  private loadKosar(): void {
    this.kosarItems = this.kosarService.getKosar();
  }

  toggleEdit(itemId: string | undefined): void {
    if (!itemId) return;
    this.editingItemId = this.editingItemId === itemId ? null : itemId;
  }

  toggleHozzavalo(item: KosarItem, index: number): void {
    item.hozzavalok[index].selected = !item.hozzavalok[index].selected;
    this.updateItem(item);
  }

  incrementExtra(item: KosarItem, extraIndex: number): void {
    item.extras[extraIndex].mennyiseg++;
    this.updateItem(item);
  }

  decrementExtra(item: KosarItem, extraIndex: number): void {
    if (item.extras[extraIndex].mennyiseg > 1) {
      item.extras[extraIndex].mennyiseg--;
      this.updateItem(item);
    }
  }

  removeExtra(item: KosarItem, extraIndex: number): void {
    item.extras.splice(extraIndex, 1);
    this.updateItem(item);
  }

  updateItem(item: KosarItem): void {
    let total = item.alapAr * item.mennyiseg;
    item.extras.forEach(extra => {
      total += extra.extra.ar * extra.mennyiseg * item.mennyiseg;
    });
    item.vegosszeg = total;
    
    if (item.id) {
      this.kosarService.updateKosarItem(item.id, item);
      this.loadKosar();
    }
  }

  increaseQuantity(item: KosarItem): void {
    item.mennyiseg++;
    this.updateItem(item);
  }

  decreaseQuantity(item: KosarItem): void {
    if (item.mennyiseg > 1) {
      item.mennyiseg--;
      this.updateItem(item);
    }
  }

  deleteItem(id: string | undefined): void {
    if (!id) return;
    if (confirm('Biztosan törölni szeretnéd ezt a tételt?')) {
      this.kosarService.removeFromKosar(id);
      this.loadKosar();
    }
  }

  clearCart(): void {
    if (confirm('Biztosan ki szeretnéd üríteni a kosarat?')) {
      this.kosarService.clearKosar();
      this.loadKosar();
    }
  }

  getTotalItems(): number {
    return this.kosarItems.reduce((sum, item) => sum + item.mennyiseg, 0);
  }

  getTotalPrice(): number {
    return this.kosarItems.reduce((sum, item) => sum + item.vegosszeg, 0);
  }

  async submitOrder(): Promise<void> {
    if (this.kosarItems.length === 0) {
      alert('A kosár üres!');
      return;
    }

    if (!confirm('Biztosan le szeretnéd adni a rendelést?')) {
      return;
    }

    try {
      alert('Rendelés sikeresen leadva!');
      this.kosarService.clearKosar();
      this.router.navigate(['/etlap']);
    } catch (error) {
      console.error('Hiba a rendelés leadása során:', error);
      alert('Hiba történt a rendelés leadása során!');
    }
  }
}

