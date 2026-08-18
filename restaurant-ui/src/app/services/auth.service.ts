import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:53477/api/Auth';

  async login(email: string, password: string): Promise<any> {
    const response = await fetch(`${this.apiUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Connexion échouée.');
    }

    const data = await response.json();

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
  }

  async updatePhoneNumber(phoneNumber: string): Promise<any> {
    const token = this.getToken();

    if (!token) {
      throw new Error('Utilisateur non connecté.');
    }

    const response = await fetch(`${this.apiUrl}/update-phone`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ phoneNumber })
    });

    if (!response.ok) {
      throw new Error('Modification du numéro échouée.');
    }

    const data = await response.json();

    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): any | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}