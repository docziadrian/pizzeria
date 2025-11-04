import { Injectable } from '@angular/core';
import axios from 'axios';
import { SessionService } from './session.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private sessionService: SessionService) {}

  register(name: string, email: string, password: string, confirm: string) {
    return axios.post(
      `${this.apiUrl}/registration`,
      { name, email, password, confirm },
      { withCredentials: true }
    );
  }

  login(email: string, password: string) {
    return axios.post(
      `${this.apiUrl}/login`,
      { email, password },
      { withCredentials: true }
    );
  }

  logout() {
    this.sessionService.clearUser();
    // Assuming no specific logout endpoint exists in the backend
    return Promise.resolve();
  }

  me() {
    // Assuming there's no dedicated "me" endpoint in the backend
    // You might need to fetch user data from the session or a similar source
    return Promise.resolve(this.sessionService.getUser());
  }
}
