import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Pizza } from '../Interfaces/Pizza';

@Injectable({
  providedIn: 'root',
})
export class PizzaService {
  private pizzaSubject = new BehaviorSubject<Pizza[]>([]);
  public pizzas$: Observable<Pizza[]> = this.pizzaSubject.asObservable();

  private apiUrl = 'http://localhost:3000/pizza';

  constructor(private api: ApiService) {}

  loadAll(): void {
    this.api
      .getAll(this.apiUrl)
      .then((response: any) => {
        if (response.status === 200) {
          this.pizzaSubject.next(response.data);
        }
      })
      .catch((error: any) => {
        console.error('Error loading categories', error);
      });
  }

  getById(id: string): Observable<Pizza> {
    return from(this.api.getOne<Pizza>(this.apiUrl, parseInt(id))).pipe(
      map((response) => response.data as Pizza)
    );
  }

  create(pizza: Partial<Pizza>): Observable<Pizza> {
    return from(this.api.post<Pizza>(this.apiUrl, pizza)).pipe(
      map((response) => response.data as Pizza),
      tap(() => this.loadAll())
    );
  }

  update(id: string, pizza: Partial<Pizza>): Observable<Pizza> {
    return from(this.api.patch<Pizza>(this.apiUrl, parseInt(id), pizza)).pipe(
      map((response) => response.data as Pizza),
      tap(() => this.loadAll())
    );
  }

  delete(id: string): Observable<any> {
    return from(this.api.delete(this.apiUrl, parseInt(id))).pipe(
      tap(() => this.loadAll())
    );
  }
}
