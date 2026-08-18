import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Restaurant } from '../../models/restaurant.model';
import { RestaurantService } from '../../services/restaurant.service';
import { AuthService } from '../../services/auth.service';
import { RestaurantCreate } from '../../models/restaurant-create.model';

@Component({
  selector: 'app-restaurateur',
  imports: [FormsModule, RouterLink],
  templateUrl: './restaurateur.html',
  styleUrl: './restaurateur.css'
})
export class Restaurateur implements OnInit {
  restaurants: Restaurant[] = [];

  name = '';
  description = '';
  address = '';
  phoneNumber = '';

  isLoading = true;
  errorMessage = '';
  successMessage = '';

  constructor(
    private restaurantService: RestaurantService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMyRestaurants();
  }

  loadMyRestaurants(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const user = this.authService.getUser();

    if (!user) {
      this.errorMessage = 'Utilisateur non connecté.';
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    this.restaurantService.getRestaurants().subscribe({
      next: (restaurants) => {
        this.restaurants = restaurants.filter(r => r.ownerId === user.id);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Impossible de charger vos restaurants.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  async createRestaurant(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    const user = this.authService.getUser();

    if (!user) {
      this.errorMessage = 'Vous devez être connecté.';
      this.cdr.detectChanges();
      return;
    }

    if (user.role !== 'Restaurateur') {
      this.errorMessage = 'Seul un restaurateur peut créer un restaurant.';
      this.cdr.detectChanges();
      return;
    }

    const restaurant: RestaurantCreate = {
      name: this.name,
      description: this.description,
      address: this.address,
      phoneNumber: this.phoneNumber,
      ownerId: user.id
    };

    try {
      await this.restaurantService.createRestaurant(restaurant);

      this.successMessage = 'Restaurant créé avec succès.';

      this.name = '';
      this.description = '';
      this.address = '';
      this.phoneNumber = '';

      this.loadMyRestaurants();
      this.cdr.detectChanges();
    } catch (error) {
      this.errorMessage = 'Impossible de créer le restaurant.';
      this.cdr.detectChanges();
    }
  }
}