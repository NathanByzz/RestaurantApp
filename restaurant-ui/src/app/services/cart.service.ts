import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart-item.model';
import { Dish } from '../models/dish.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartItem[] = [];

  getItems(): CartItem[] {
    return this.items;
  }

  addToCart(dish: Dish): void {
    const existingItem = this.items.find(item => item.dish.id === dish.id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.items.push({
        dish,
        quantity: 1
      });
    }
  }

  removeFromCart(dishId: number): void {
    this.items = this.items.filter(item => item.dish.id !== dishId);
  }

  increaseQuantity(dishId: number): void {
    const item = this.items.find(item => item.dish.id === dishId);

    if (item) {
      item.quantity++;
    }
  }

  decreaseQuantity(dishId: number): void {
    const item = this.items.find(item => item.dish.id === dishId);

    if (!item) {
      return;
    }

    item.quantity--;

    if (item.quantity <= 0) {
      this.removeFromCart(dishId);
    }
  }

  getTotal(): number {
    return this.items.reduce((total, item) => {
      return total + item.dish.price * item.quantity;
    }, 0);
  }

  clearCart(): void {
    this.items = [];
  }
}