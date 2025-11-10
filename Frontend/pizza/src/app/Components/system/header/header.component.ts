import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../Services/api.service';
import { Pizza } from '../../../Interfaces/Pizza';
import { ApiResponse } from '../../../Interfaces/ApiResponse';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
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
