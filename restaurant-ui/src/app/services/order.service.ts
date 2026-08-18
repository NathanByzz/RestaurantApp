import { Injectable } from '@angular/core';
import { OrderCreate } from '../models/order-create.model';
import { Order } from '../models/order.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly apiUrl = 'http://localhost:53477/api/Orders';

  constructor(private authService: AuthService) {}

  async createOrder(order: OrderCreate): Promise<any> {
    const token = this.authService.getToken();

    if (!token) {
      throw new Error('Vous devez être connecté pour commander.');
    }

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(order)
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la création de la commande : ${response.status}`);
    }

    return await response.json();
  }

  async getOrders(): Promise<Order[]> {
    const token = this.authService.getToken();

    if (!token) {
      throw new Error('Vous devez être connecté pour voir les commandes.');
    }

    const response = await fetch(this.apiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur lors du chargement des commandes : ${response.status}`);
    }

    return await response.json();
  }

  async getMyOrders(): Promise<Order[]> {
    const user = this.authService.getUser();

    if (!user) {
      throw new Error('Utilisateur non connecté.');
    }

    const orders = await this.getOrders();

    return orders.filter(order => order.clientId === user.id);
  }

  async getOrdersByRestaurant(restaurantId: number): Promise<Order[]> {
    const token = this.authService.getToken();

    if (!token) {
      throw new Error('Vous devez être connecté.');
    }

    const response = await fetch(`${this.apiUrl}/restaurant/${restaurantId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur lors du chargement des commandes du restaurant : ${response.status}`);
    }

    return await response.json();
  }

  async getOrdersForDelivery(): Promise<Order[]> {
    const orders = await this.getOrders();

    return orders
      .filter(order =>
        order.status === 'Preparing' ||
        order.status === 'InDelivery'
      )
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }

  async takeOrder(orderId: number): Promise<void> {
    const token = this.authService.getToken();

    if (!token) {
      throw new Error('Vous devez être connecté.');
    }

    const response = await fetch(`${this.apiUrl}/${orderId}/take`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la prise en charge de la commande : ${response.status}`);
    }
  }

  async updateOrderStatus(orderId: number, status: string): Promise<void> {
    const token = this.authService.getToken();

    if (!token) {
      throw new Error('Vous devez être connecté.');
    }

    const response = await fetch(`${this.apiUrl}/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(status)
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la modification du statut : ${response.status}`);
    }
  }
}