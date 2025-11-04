import { Component, OnInit } from '@angular/core';
import { PizzaService } from '../../../../Services/pizza.service';
import { ApiService } from '../../../../Services/api.service';
import { ApiResponse } from '../../../../Interfaces/ApiResponse';
import { Pizza } from '../../../../Interfaces/Pizza';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pizza-megjelenit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pizza-megjelenit.component.html',
  styleUrl: './pizza-megjelenit.component.scss',
})
export class PizzaMegjelenitComponent implements OnInit {
  constructor(private apiService: ApiService) {}

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
        });
        this.allPizza = response.data;
      });
  }

  ngOnInit(): void {
    this.getAllPizzas();
  }
}
