import { Injectable } from '@angular/core';
import { KosarItem } from '../Interfaces/Extras';

@Injectable({
  providedIn: 'root',
})
export class KosarService {
  private readonly STORAGE_KEY = 'foodmonster_kosar';

  constructor() {}

  getKosar(): KosarItem[] {
    const kosarJson = localStorage.getItem(this.STORAGE_KEY);
    return kosarJson ? JSON.parse(kosarJson) : [];
  }

  addToKosar(item: KosarItem): void {
    const kosar = this.getKosar();
    item.id = this.generateId();
    kosar.push(item);
    this.saveKosar(kosar);
  }

  updateKosarItem(id: string, updatedItem: KosarItem): void {
    const kosar = this.getKosar();
    const index = kosar.findIndex((item) => item.id === id);
    if (index !== -1) {
      kosar[index] = { ...updatedItem, id };
      this.saveKosar(kosar);
    }
  }

  removeFromKosar(id: string): void {
    const kosar = this.getKosar();
    const filtered = kosar.filter((item) => item.id !== id);
    this.saveKosar(filtered);
  }

  clearKosar(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  getKosarCount(): number {
    return this.getKosar().length;
  }

  getKosarTotal(): number {
    const kosar = this.getKosar();
    return kosar.reduce((total, item) => total + item.vegosszeg, 0);
  }

  private saveKosar(kosar: KosarItem[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(kosar));
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

