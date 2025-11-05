import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageItem } from '../Interfaces/LocalStorageItem';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService {
  // Ez a service a localStorage kezelésére szolgál, pizza felvétele, update, törlés stb.
  private localStorageSubject = new BehaviorSubject<any>([]);
  public pizzas$: Observable<any> = this.localStorageSubject.asObservable();
  constructor(private api: ApiService) {}

  getAllItems(): any[] {
    const items = localStorage.getItem('pizzas');
    return items ? JSON.parse(items) : [];
  }

  saveItems(items: LocalStorageItem[]): void {
    localStorage.setItem('pizzas', JSON.stringify(items));
    this.localStorageSubject.next(items);
  }

  addItem(item: LocalStorageItem): void {
    const items = this.getAllItems();
    if (items.find((i) => i.id === item.id)) {
      // Ha már létezik az adott pizza, emeljük csak a mennyiséget
      const increasedAmount =
        (items.find((i) => i.id === item.id)?.amount || 0) + (item.amount || 1);

      this.updateItem(item.id, { ...item, amount: increasedAmount });
      return;
    }
    items.push(item);
    this.saveItems(items);
    this.updateCartInNavbar(); //TODO: Önmagában nem elég, fel kell iratkoztatni a pizza komponenseknel
  }

  updateItem(id: number, updatedItem: LocalStorageItem): void {
    const items = this.getAllItems();
    const index = items.findIndex((item) => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updatedItem };
      this.saveItems(items);
    }
  }

  deleteItem(id: number): void {
    const items = this.getAllItems();
    const filteredItems = items.filter((item) => item.id !== id);
    this.saveItems(filteredItems);
  }

  clearAll(): void {
    localStorage.removeItem('pizzas');
    this.localStorageSubject.next([]);
  }

  updateCartInNavbar(): number {
    const allAmount = this.getAllItems().length;
    return allAmount;
  }
}
