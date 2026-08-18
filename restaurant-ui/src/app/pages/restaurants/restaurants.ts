import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Restaurant } from '../../models/restaurant.model';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-restaurants',
  imports: [RouterLink],
  templateUrl: './restaurants.html',
  styleUrl: './restaurants.css'
})
export class Restaurants implements OnInit {
  restaurants: Restaurant[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private restaurantService: RestaurantService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.restaurantService.getRestaurants().subscribe({
      next: (restaurants) => {
        this.restaurants = restaurants;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les restaurants.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}