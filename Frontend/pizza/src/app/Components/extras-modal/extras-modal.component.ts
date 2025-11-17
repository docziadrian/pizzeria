import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../Services/api.service';
import { KosarService } from '../../Services/kosar.service';
import { Extra, SelectedExtra, Hozzavalo } from '../../Interfaces/Extras';

interface Termek {
  id: number;
  nev: string;
  leiras: string;
  ar: number;
  kategoriaId: number;
  kepURL: string;
  hozzavalok: string[];
}

@Component({
  selector: 'app-extras-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './extras-modal.component.html',
  styleUrl: './extras-modal.component.scss',
})
export class ExtrasModalComponent implements OnInit {
  @Input() termek!: Termek;
  @Input() kategoriaNev!: string;
  @Output() close = new EventEmitter<void>();

  availableExtras: Extra[] = [];
  selectedExtras: Map<number, SelectedExtra> = new Map();
  hozzavalok: Hozzavalo[] = [];
  megjegyzes: string = '';
  isLoading: boolean = true;
  vegosszeg: number = 0;

  constructor(
    private apiService: ApiService,
    private kosarService: KosarService
  ) {}

  async ngOnInit() {
    this.initializeHozzavalok();
    await this.loadExtras();
    this.calculateTotal();
  }

  initializeHozzavalok() {
    if (this.termek.hozzavalok && this.termek.hozzavalok.length > 0) {
      this.hozzavalok = this.termek.hozzavalok.map((h) => ({
        nev: h,
        selected: true,
      }));
    }
  }

  async loadExtras() {
    try {
      this.isLoading = true;
      const tipus = this.getTipus();
      if (tipus) {
        const response = await this.apiService.getAll(
          `http://localhost:3000/extras/tipus/eq/${tipus}`
        );
        this.availableExtras = response.data;
      }
    } catch (error) {
      console.error('Error loading extras:', error);
    } finally {
      this.isLoading = false;
    }
  }

  getTipus(): 'pizza' | 'hamburger' | null {
    const lowerKategoria = this.kategoriaNev.toLowerCase();
    if (lowerKategoria.includes('pizza')) return 'pizza';
    if (lowerKategoria.includes('hamburger') || lowerKategoria.includes('burger')) return 'hamburger';
    return null;
  }

  increment(extra: Extra) {
    const existing = this.selectedExtras.get(extra.id);
    if (existing) {
      existing.mennyiseg++;
    } else {
      this.selectedExtras.set(extra.id, {
        extra,
        mennyiseg: 1,
      });
    }
    this.calculateTotal();
  }

  decrement(extra: Extra) {
    const existing = this.selectedExtras.get(extra.id);
    if (existing) {
      if (existing.mennyiseg > 1) {
        existing.mennyiseg--;
      } else {
        this.selectedExtras.delete(extra.id);
      }
      this.calculateTotal();
    }
  }

  remove(extraId: number) {
    this.selectedExtras.delete(extraId);
    this.calculateTotal();
  }

  getQuantity(extraId: number): number {
    return this.selectedExtras.get(extraId)?.mennyiseg || 0;
  }

  calculateTotal() {
    let total = this.termek.ar;
    this.selectedExtras.forEach((selected) => {
      total += selected.extra.ar * selected.mennyiseg;
    });
    this.vegosszeg = total;
  }

  toggleHozzavalo(index: number) {
    this.hozzavalok[index].selected = !this.hozzavalok[index].selected;
  }

  async save() {
    const kosarItem = {
      termekId: this.termek.id,
      termekNev: this.termek.nev,
      termekKepURL: this.termek.kepURL,
      kategoriaId: this.termek.kategoriaId,
      kategoriaNev: this.kategoriaNev,
      alapAr: this.termek.ar,
      mennyiseg: 1,
      hozzavalok: [...this.hozzavalok],
      extras: Array.from(this.selectedExtras.values()),
      megjegyzes: this.megjegyzes,
      vegosszeg: this.vegosszeg,
    };

    this.kosarService.addToKosar(kosarItem);
    this.close.emit();
  }

  closeModal() {
    this.close.emit();
  }
}

