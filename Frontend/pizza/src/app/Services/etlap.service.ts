import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ApiResponse } from '../Interfaces/ApiResponse';
import { Etlap } from '../Interfaces/Etlap';

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
  hozzavalok: string;
  averageRating: number;
  reviewCount: number;
  videoURL?: string;
  rendelesekSzama: number;
}

@Injectable({
  providedIn: 'root',
})
export class EtlapService {
  private baseURL = 'http://localhost:3000';

  constructor(private apiService: ApiService) {}

  async getKategoriak(): Promise<Kategoria[]> {
    try {
      const response = await this.apiService.getAll(
        `${this.baseURL}/kategoria`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async getTermekek(): Promise<Termek[]> {
    try {
      const response = await this.apiService.getAll(`${this.baseURL}/termek`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getEtlap(): Promise<Etlap[]> {
    try {
      const [kategoriak, termekek] = await Promise.all([
        this.getKategoriak(),
        this.getTermekek(),
      ]);

      return kategoriak.map((kategoria) => ({
        kategoria: {
          id: kategoria.id,
          nev: kategoria.nev,
        },
        termekek: termekek
          .filter((termek) => termek.kategoriaId === kategoria.id)
          .map((termek) => ({
            id: termek.id,
            nev: termek.nev,
            leiras: termek.leiras,
            ar: termek.ar,
            kategoria: {
              id: kategoria.id,
              nev: kategoria.nev,
            },
            kepURL: termek.kepURL,
            hozzavalok: JSON.parse(termek.hozzavalok || '[]'),
            averageRating: termek.averageRating,
            reviewCount: termek.reviewCount,
            videoURL: termek.videoURL,
          })),
      }));
    } catch (error) {
      console.error('Error fetching menu:', error);
      throw error;
    }
  }

  async getTermekByKategoria(kategoriaId: number): Promise<Termek[]> {
    try {
      const response = await this.apiService.getAll(
        `${this.baseURL}/termek/kategoriaId/eq/${kategoriaId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  }
}

