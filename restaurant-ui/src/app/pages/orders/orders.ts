import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-orders',
  imports: [RouterLink, DecimalPipe, DatePipe],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {
  orders: Order[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.orders = await this.orderService.getMyOrders();
    } catch (error) {
      this.errorMessage = 'Impossible de charger vos commandes.';
      console.error(error);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }
}