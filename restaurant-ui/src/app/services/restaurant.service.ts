import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Restaurant } from '../models/restaurant.model';
import { RestaurantCreate } from '../models/restaurant-create.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private readonly apiUrl = 'http://localhost:53477/api/Restaurants';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(this.apiUrl);
  }

  getRestaurantById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  async createRestaurant(restaurant: RestaurantCreate): Promise<Restaurant> {
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
      body: JSON.stringify(restaurant)
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la création du restaurant : ${response.status}`);
    }

    return await response.json();
  }
}