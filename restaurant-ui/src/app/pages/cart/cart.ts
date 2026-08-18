import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CartItem } from '../../models/cart-item.model';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { OrderCreate } from '../../models/order-create.model';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, DecimalPipe, FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  items: CartItem[] = [];

  deliveryAddress = '456 rue du Client';

  errorMessage = '';
  successMessage = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.refreshCart();
  }

  refreshCart(): void {
    this.items = this.cartService.getItems();
  }

  increaseQuantity(dishId: number): void {
    this.cartService.increaseQuantity(dishId);
    this.refreshCart();
  }

  decreaseQuantity(dishId: number): void {
    this.cartService.decreaseQuantity(dishId);
    this.refreshCart();
  }

  removeFromCart(dishId: number): void {
    this.cartService.removeFromCart(dishId);
    this.refreshCart();
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }

  async checkout(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.items.length === 0) {
      this.errorMessage = 'Votre panier est vide.';
      this.cdr.detectChanges();
      return;
    }

    if (!this.deliveryAddress.trim()) {
  this.errorMessage = 'L’adresse de livraison est obligatoire.';
  this.cdr.detectChanges();
  return;
}

    const user = this.authService.getUser();

    if (!user) {
      this.errorMessage = 'Vous devez vous connecter avant de commander.';
      this.cdr.detectChanges();
      return;
    }

    const restaurantId = this.items[0].dish.restaurantId;

    const order: OrderCreate = {
      clientId: user.id,
      restaurantId: restaurantId,
      deliveryAddress: this.deliveryAddress,
      items: this.items.map(item => ({
        dishId: item.dish.id,
        quantity: item.quantity
      }))
    };

    try {
      const createdOrder = await this.orderService.createOrder(order);

      this.cartService.clearCart();
      this.refreshCart();

      this.successMessage =
        `Commande #${createdOrder.id} créée avec succès. Total : ${createdOrder.totalAmount.toFixed(2)} $.`;

      this.cdr.detectChanges();
    } catch (error) {
      this.errorMessage =
        'Impossible de créer la commande. Vérifiez que vous êtes connecté comme Client.';

      this.cdr.detectChanges();
    }
  }
}