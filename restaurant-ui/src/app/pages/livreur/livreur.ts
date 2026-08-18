import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';

import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-livreur',
  imports: [
    DecimalPipe,
    DatePipe,
    FormsModule,
    MatIconModule
  ],
  templateUrl: './livreur.html',
  styleUrl: './livreur.css'
})
export class Livreur implements OnInit {
  orders: Order[] = [];

  isLoading = true;
  errorMessage = '';
  successMessage = '';

  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  async loadOrders(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      this.orders = await this.orderService.getOrdersForDelivery();
    } catch (error) {
      this.errorMessage = 'Impossible de charger les commandes à livrer.';
      console.error(error);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  async takeOrder(order: Order): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    try {
      await this.orderService.takeOrder(order.id);

      this.successMessage = `Commande #${order.id} prise en charge avec succès.`;

      await this.loadOrders();

      this.cdr.detectChanges();
    } catch (error) {
      this.errorMessage = 'Impossible de prendre cette commande. Elle a peut-être déjà été prise par un autre livreur.';
      console.error(error);
      this.cdr.detectChanges();
    }
  }

  async markAsDelivered(order: Order): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    try {
      await this.orderService.updateOrderStatus(order.id, 'Delivered');

      this.successMessage = `Commande #${order.id} marquée comme livrée.`;

      this.orders = this.orders.filter(o => o.id !== order.id);

      this.cdr.detectChanges();
    } catch (error) {
      this.errorMessage = 'Impossible de marquer cette commande comme livrée.';
      console.error(error);
      this.cdr.detectChanges();
    }
  }
}