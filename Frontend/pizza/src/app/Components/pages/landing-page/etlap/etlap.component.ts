import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EtlapService } from '../../../../Services/etlap.service';

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

@Component({
  selector: 'app-etlap',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './etlap.component.html',
  styleUrl: './etlap.component.scss',
})
export class EtlapComponent implements OnInit {
  @Input() previewMode: boolean = true;
  @Input() maxItems: number = 9;

  kategoriak: Kategoria[] = [];
  termekek: Termek[] = [];
  isLoading: boolean = true;

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
      let allTermekek = termekek.map((t) => ({
        ...t,
        hozzavalok: JSON.parse(t.hozzavalok || '[]'),
      }));

      if (this.previewMode) {
        this.termekek = allTermekek.slice(0, this.maxItems);
      } else {
        this.termekek = allTermekek;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  getKategoriaNev(kategoriaId: number): string {
    return (
      this.kategoriak.find((k) => k.id === kategoriaId)?.nev || 'Ismeretlen'
    );
  }
}
