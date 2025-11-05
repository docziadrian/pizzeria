import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../Services/order.service';
import { ApiService } from '../../../Services/api.service';
import { Orders } from '../../../Interfaces/Orders';
import { User } from '../../../Interfaces/User';
import { Pizza } from '../../../Interfaces/Pizza';

@Component({
  selector: 'app-rendelesek-kezelese',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rendelesek-kezelese.component.html',
  styleUrl: './rendelesek-kezelese.component.scss',
})
export class RendelesekKezeleseComponent implements OnInit {
  orders: Orders[] = [];
  filteredOrders: Orders[] = [];
  users: User[] = [];
  pizzas: Pizza[] = [];
  searchTerm: string = '';
  showModal: boolean = false;
  isEditMode: boolean = false;

  currentOrder: Orders = {
    id: 0,
    userID: 0,
    pizzaID: 0,
    quantity: 1,
    datum: new Date().toISOString().split('T')[0],
    status: 'folyamatban',
  };

  constructor(private orderService: OrderService, private api: ApiService) {
    this.loadUsers();
    this.loadPizzas();
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  async loadData(): Promise<void> {
    await Promise.all([this.loadOrders(), this.loadUsers(), this.loadPizzas()]);
  }

  async loadOrders(): Promise<void> {
    try {
      this.orders = await this.orderService.getAllOrders();
      this.enrichOrdersWithNames();
      this.filteredOrders = this.orders;
    } catch (error) {
      console.error('Hiba:', error);
      alert('Hiba történt a rendelések betöltése során!');
    }
  }

  async loadUsers(): Promise<void> {
    try {
      const response = await this.api.getAll(this.api.baseURL + 'users');
      this.users = response.data;
    } catch (error) {
      console.error('Hiba:', error);
    }
  }

  async loadPizzas(): Promise<void> {
    try {
      const response = await this.api.getAll(this.api.baseURL + 'pizza');
      this.pizzas = response.data;
    } catch (error) {
      console.error('Hiba:', error);
    }
  }

  enrichOrdersWithNames(): void {
    this.orders = this.orders.map((order) => {
      const user = this.users.find((u) => u.id === order.userID);

      const pizza = this.pizzas.find((p) => p.id === order.pizzaID);
      return {
        ...order,
        userName: user?.name || 'Ismeretlen',
        pizzaName: pizza?.nev || 'Ismeretlen',
      };
    });
  }

  filterOrders(): void {
    if (!this.searchTerm) {
      this.filteredOrders = this.orders;
      return;
    }

    this.filteredOrders = this.orders.filter(
      (order) =>
        order.userName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.pizzaName
          ?.toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        order.status.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openEditModal(order: Orders): void {
    this.isEditMode = true;
    this.currentOrder = { ...order };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  async saveOrder(): Promise<void> {
    try {
      await this.orderService.updateOrder(this.currentOrder.id, {
        status: this.currentOrder.status,
      });
      alert('Rendelés sikeresen frissítve!');
      await this.loadOrders();
      this.closeModal();
    } catch (error) {
      console.error('Hiba:', error);
      alert('Hiba történt a mentés során!');
    }
  }

  async deleteOrder(id: number): Promise<void> {
    if (!confirm('Biztosan törölni szeretnéd ezt a rendelést?')) {
      return;
    }

    try {
      await this.orderService.deleteOrder(id);
      alert('Rendelés sikeresen törölve!');
      await this.loadOrders();
    } catch (error) {
      console.error('Hiba:', error);
      alert('Hiba történt a törlés során!');
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'folyamatban':
        return 'bg-yellow-100 text-yellow-800';
      case 'kész':
        return 'bg-green-100 text-green-800';
      case 'megszakítva':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'folyamatban':
        return 'Folyamatban';
      case 'kész':
        return 'Kész';
      case 'megszakítva':
        return 'Megszakítva';
      default:
        return status;
    }
  }
}
