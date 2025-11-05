import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../Services/api.service';
import { Role, User } from '../../../Interfaces/User';

@Component({
  selector: 'app-felhasznalo-kezeles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './felhasznalo-kezeles.component.html',
  styleUrl: './felhasznalo-kezeles.component.scss',
})
export class FelhasznaloKezelesComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  showModal: boolean = false;
  isEditMode: boolean = false;

  currentUser: User = {
    id: 0,
    name: '',
    email: '',
    password: '',
    role: 'user' as unknown as Role,
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // Felhasználók betöltése
  loadUsers(): void {
    this.api
      .getAll(this.api.baseURL + 'users')
      .then((response: any) => {
        this.users = response.data;
        this.filteredUsers = this.users;
      })
      .catch((error: any) => {
        console.error('Hiba a felhasználók betöltése során:', error);
        alert('Hiba történt a felhasználók betöltése során!');
      });
  }

  // Keresés
  filterUsers(): void {
    if (!this.searchTerm) {
      this.filteredUsers = this.users;
      return;
    }

    this.filteredUsers = this.users.filter(
      (user) =>
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Modal megnyitása új felhasználóhoz
  openAddModal(): void {
    this.isEditMode = false;
    this.currentUser = {
      id: 0,
      name: '',
      email: '',
      password: '',
      role: 'user' as unknown as Role,
    };
    this.showModal = true;
  }

  // Modal megnyitása szerkesztéshez
  openEditModal(user: User): void {
    this.isEditMode = true;
    this.currentUser = { ...user, password: '' };
    this.showModal = true;
  }

  // Modal bezárása
  closeModal(): void {
    this.showModal = false;
  }

  // Felhasználó mentése (új vagy szerkesztett)
  saveUser(): void {
    if (!this.currentUser.name || !this.currentUser.email) {
      alert('Kérlek töltsd ki az összes kötelező mezőt!');
      return;
    }

    if (this.isEditMode) {
      // Szerkesztés
      const updateData: any = {
        name: this.currentUser.name,
        email: this.currentUser.email,
        role: this.currentUser.role,
      };

      if (this.currentUser.password) {
        updateData.password = this.currentUser.password;
      }

      this.api
        .patch(this.api.baseURL + 'users', this.currentUser.id, updateData)
        .then(() => {
          alert('Felhasználó sikeresen frissítve!');
          this.loadUsers();
          this.closeModal();
        })
        .catch((error: any) => {
          console.error('Hiba:', error);
          alert('Hiba történt a mentés során!');
        });
    } else {
      // Új felhasználó
      if (!this.currentUser.password) {
        alert('Jelszó megadása kötelező!');
        return;
      }

      this.api
        .post(this.api.baseURL + 'users', this.currentUser)
        .then(() => {
          alert('Felhasználó sikeresen létrehozva!');
          this.loadUsers();
          this.closeModal();
        })
        .catch((error: any) => {
          console.error('Hiba:', error);
          alert('Hiba történt a mentés során!');
        });
    }
  }

  // Felhasználó törlése
  deleteUser(id: number): void {
    if (!confirm('Biztosan törölni szeretnéd ezt a felhasználót?')) {
      return;
    }

    this.api
      .delete(this.api.baseURL + 'users', id)
      .then(() => {
        alert('Felhasználó sikeresen törölve!');
        this.loadUsers();
      })
      .catch((error: any) => {
        console.error('Hiba:', error);
        alert('Hiba történt a törlés során!');
      });
  }

  // Szerep váltása
  getRoleBadgeClass(role: string): string {
    return role === 'admin'
      ? 'bg-purple-100 text-purple-800'
      : 'bg-blue-100 text-blue-800';
  }
}
