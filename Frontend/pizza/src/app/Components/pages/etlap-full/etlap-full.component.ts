import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EtlapService } from '../../../Services/etlap.service';
import { ExtrasModalComponent } from '../../extras-modal/extras-modal.component';

interface Kategoria {
  id: number;
  nev: string;
}

interface Termek {
  id: number;
  nev: string;
  leiras: string;
  ar: number;
  kategoriaId: number;
  kepURL: string;
  hozzavalok: string[];
  averageRating: number;
  reviewCount: number;
  videoURL?: string;
  rendelesekSzama: number;
}

type SortOption =
  | 'ar-alacsony'
  | 'ar-magas'
  | 'ertekeles-magas'
  | 'ertekeles-alacsony'
  | 'a-z'
  | 'megrendelesek';

@Component({
  selector: 'app-etlap-full',
  standalone: true,
  imports: [CommonModule, FormsModule, ExtrasModalComponent],
  templateUrl: './etlap-full.component.html',
  styleUrl: './etlap-full.component.scss',
})
export class EtlapFullComponent implements OnInit {
  kategoriak: Kategoria[] = [];
  osszesFoodItem: Termek[] = [];
  szurtFoodItems: Termek[] = [];
  selectedKategoriaId: number | null = null;
  searchQuery: string = '';
  sortBy: SortOption = 'a-z';
  isLoading: boolean = true;
  showExtrasModal: boolean = false;
  selectedTermek: Termek | null = null;

  constructor(private etlapService: EtlapService) {}

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    try {
      this.isLoading = true;
      const [kategoriak, termekek] = await Promise.all([
        this.etlapService.getKategoriak(),
        this.etlapService.getTermekek(),
      ]);

      this.kategoriak = kategoriak;
      this.osszesFoodItem = termekek.map((t) => ({
        ...t,
        hozzavalok: JSON.parse(t.hozzavalok || '[]'),
      }));
      this.applyFilters();
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  selectKategoria(kategoriaId: number | null) {
    this.selectedKategoriaId = kategoriaId;
    this.applyFilters();
  }

  onSearchChange() {
    this.applyFilters();
  }

  onSortChange() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.osszesFoodItem];

    if (this.selectedKategoriaId !== null) {
      filtered = filtered.filter(
        (item) => item.kategoriaId === this.selectedKategoriaId
      );
    }

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.nev.toLowerCase().includes(query) ||
          item.leiras.toLowerCase().includes(query)
      );
    }

    filtered = this.sortItems(filtered);
    this.szurtFoodItems = filtered;
  }

  sortItems(items: Termek[]): Termek[] {
    switch (this.sortBy) {
      case 'ar-alacsony':
        return items.sort((a, b) => a.ar - b.ar);
      case 'ar-magas':
        return items.sort((a, b) => b.ar - a.ar);
      case 'ertekeles-magas':
        return items.sort((a, b) => b.averageRating - a.averageRating);
      case 'ertekeles-alacsony':
        return items.sort((a, b) => a.averageRating - b.averageRating);
      case 'a-z':
        return items.sort((a, b) => a.nev.localeCompare(b.nev));
      case 'megrendelesek':
        return items.sort((a, b) => b.rendelesekSzama - a.rendelesekSzama);
      default:
        return items;
    }
  }

  getKategoriaNev(kategoriaId: number): string {
    return (
      this.kategoriak.find((k) => k.id === kategoriaId)?.nev || 'Ismeretlen'
    );
  }

  openExtrasModal(termek: Termek) {
    this.selectedTermek = termek;
    this.showExtrasModal = true;
  }

  closeExtrasModal() {
    this.showExtrasModal = false;
    this.selectedTermek = null;
  }
}

