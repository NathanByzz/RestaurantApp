import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Dish } from '../../models/dish.model';
import { CartService } from '../../services/cart.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-restaurant-details',
  imports: [RouterLink, DecimalPipe, MatIconModule],
  templateUrl: './restaurant-details.html',
  styleUrl: './restaurant-details.css'
})
export class RestaurantDetails implements OnInit {
  restaurantId = 0;
  dishes: Dish[] = [];
  isLoading = true;
  errorMessage = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.restaurantId = Number(this.route.snapshot.paramMap.get('id'));

    try {
      const response = await fetch(
        `http://localhost:53477/api/Dishes/restaurant/${this.restaurantId}`
      );

      if (!response.ok) {
        throw new Error(`Erreur API : ${response.status}`);
      }

      this.dishes = await response.json();
    } catch (error) {
      this.errorMessage = 'Impossible de charger le menu du restaurant.';
      console.error(error);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  addToCart(dish: Dish): void {
    this.cartService.addToCart(dish);
    this.successMessage = `${dish.name} ajouté au panier.`;
    this.cdr.detectChanges();
  }
}