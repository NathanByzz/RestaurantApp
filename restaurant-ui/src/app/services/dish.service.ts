import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Dish } from '../models/dish.model';
import { DishCreate } from '../models/dish-create.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DishService {
  private readonly apiUrl = 'http://localhost:53477/api/Dishes';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getDishes(): Observable<Dish[]> {
    return this.http.get<Dish[]>(this.apiUrl);
  }

  getDishesByRestaurant(restaurantId: number): Observable<Dish[]> {
    return this.http.get<Dish[]>(`${this.apiUrl}/restaurant/${restaurantId}`);
  }

  async createDish(dish: DishCreate): Promise<Dish> {
    const token = this.authService.getToken();

    if (!token) {
      throw new Error('Vous devez être connecté.');
    }

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(dish)
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la création du plat : ${response.status}`);
    }

    return await response.json();
  }

  async updateDish(id: number, dish: DishCreate): Promise<void> {
    const token = this.authService.getToken();

    if (!token) {
      throw new Error('Vous devez être connecté.');
    }

    const response = await fetch(`${this.apiUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(dish)
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la modification du plat : ${response.status}`);
    }
  }

  async deleteDish(id: number): Promise<void> {
    const token = this.authService.getToken();

    if (!token) {
      throw new Error('Vous devez être connecté.');
    }

    const response = await fetch(`${this.apiUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la suppression du plat : ${response.status}`);
    }
  }
}