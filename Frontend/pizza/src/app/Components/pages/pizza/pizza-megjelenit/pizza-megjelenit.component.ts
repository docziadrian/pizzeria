import { Component, OnInit } from '@angular/core';
import { PizzaService } from '../../../../Services/pizza.service';
import { ApiService } from '../../../../Services/api.service';
import { ApiResponse } from '../../../../Interfaces/ApiResponse';
import { Pizza } from '../../../../Interfaces/Pizza';
import { CommonModule } from '@angular/common';
import { LocalstorageService } from '../../../../Services/localstorage.service';

@Component({
  selector: 'app-pizza-megjelenit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pizza-megjelenit.component.html',
  styleUrl: './pizza-megjelenit.component.scss',
})
export class PizzaMegjelenitComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    private localStorageService: LocalstorageService
  ) {}

  allPizza: Pizza[] = [];

  getAllPizzas() {
    this.apiService
      .getAll('http://localhost:3000/pizza')
      .then((response: ApiResponse<Pizza[]>) => {
        console.log(response.data);
        let hozzaValokArray: string[] = [];
        response.data.forEach((pizza: any) => {
          hozzaValokArray = pizza.hozzavalok.split(',');
          pizza.hozzavalok = hozzaValokArray.map((item) => item.trim());
          pizza.isHovering = false; // Inicializálás
        });
        this.allPizza = response.data;
      });
  }

  ngOnInit(): void {
    this.getAllPizzas();
  }

  vasarolPizza(pizza: Pizza) {
    const pizzaToAdd = {
      id: pizza.id,
      name: pizza.nev,
      price: pizza.ar,
      amount: 1,
      imgUrl: pizza.kepURL,
    };
    this.localStorageService.addItem(pizzaToAdd);
  }

  // Mouse hover kezelés
  onMouseEnter(pizza: any) {
    pizza.isHovering = true;
  }

  onMouseLeave(pizza: any) {
    pizza.isHovering = false;
  }

  // Csillagok array generálása
  getStarsArray(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  // Üres csillagok array
  getEmptyStarsArray(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }
}
