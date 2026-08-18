import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Order } from '../../models/order.model';
import { Restaurant } from '../../models/restaurant.model';
import { OrderService } from '../../services/order.service';
import { RestaurantService } from '../../services/restaurant.service';
import { AuthService } from '../../services/auth.service';
import { DishService } from '../../services/dish.service';

@Component({
  selector: 'app-restaurateur-orders',
  imports: [RouterLink, DecimalPipe, DatePipe, FormsModule],
  templateUrl: './restaurateur-orders.html',
  styleUrl: './restaurateur-orders.css'
})
export class RestaurateurOrders implements OnInit {
  restaurants: Restaurant[] = [];
  orders: Order[] = [];

  statuses = ['Pending', 'Preparing', 'Cancelled'];

  isLoading = true;
  errorMessage = '';
  successMessage = '';

  constructor(
  private orderService: OrderService,
  private restaurantService: RestaurantService,
  private dishService: DishService,
  private authService: AuthService,
  private cdr: ChangeDetectorRef
) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const user = this.authService.getUser();

    if (!user) {
      this.errorMessage = 'Utilisateur non connecté.';
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    this.restaurantService.getRestaurants().subscribe({
      next: async (restaurants) => {
        try {
          this.restaurants = restaurants.filter(r => r.ownerId === user.id);

         const ordersByRestaurant = await Promise.all(
  this.restaurants.map(async (restaurant) => {
    const orders = await this.orderService.getOrdersByRestaurant(restaurant.id);

    const dishes = await new Promise<any[]>((resolve, reject) => {
      this.dishService.getDishesByRestaurant(restaurant.id).subscribe({
        next: resolve,
        error: reject
      });
    });

    return orders.map(order => ({
      ...order,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      items: order.items.map(item => {
        const dish = dishes.find(d => d.id === item.dishId);

        return {
          ...item,
          dishName: item.dishName || dish?.name || `Plat #${item.dishId}`
        };
      })
    }));
  })
);

this.orders = ordersByRestaurant
  .flat()
  .sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

          this.isLoading = false;
          this.cdr.detectChanges();
        } catch (error) {
          this.errorMessage = 'Impossible de charger les commandes reçues.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.errorMessage = 'Impossible de charger vos restaurants.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getRestaurantName(restaurantId: number): string {
    const restaurant = this.restaurants.find(r => r.id === restaurantId);
    return restaurant ? restaurant.name : `Restaurant #${restaurantId}`;
  }

  async updateStatus(order: Order, newStatus: string): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    try {
      await this.orderService.updateOrderStatus(order.id, newStatus);

      order.status = newStatus;
      this.successMessage = `Statut de la commande #${order.id} modifié avec succès.`;

      this.cdr.detectChanges();
    } catch (error) {
      this.errorMessage = 'Impossible de modifier le statut de la commande.';
      this.cdr.detectChanges();
    }
  }
}