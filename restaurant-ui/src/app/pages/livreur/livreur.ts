import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-livreur',
  imports: [DecimalPipe, DatePipe,MatIconModule, FormsModule],
  templateUrl: './livreur.html',
  styleUrl: './livreur.css'
})
export class Livreur implements OnInit {
  orders: Order[] = [];

  statuses = ['InDelivery', 'Delivered'];

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

  async updateStatus(order: Order, newStatus: string): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    try {
      await this.orderService.updateOrderStatus(order.id, newStatus);

      order.status = newStatus;
      this.successMessage = `Statut de la commande #${order.id} modifié avec succès.`;

      if (newStatus === 'Delivered') {
        this.orders = this.orders.filter(o => o.id !== order.id);
      }

      this.cdr.detectChanges();
    } catch (error) {
      this.errorMessage = 'Impossible de modifier le statut de la commande.';
      console.error(error);
      this.cdr.detectChanges();
    }
  }
}