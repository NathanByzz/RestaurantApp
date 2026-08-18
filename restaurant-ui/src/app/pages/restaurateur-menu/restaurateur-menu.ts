import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Dish } from '../../models/dish.model';
import { DishService } from '../../services/dish.service';
import { DishCreate } from '../../models/dish-create.model';

import { MatIconModule } from '@angular/material/icon';

interface RestaurantInfo {
  id: number;
  name: string;
  description: string;
  address: string;
  phoneNumber: string;
  isActive: boolean;
  ownerId: number;
}

@Component({
  selector: 'app-restaurateur-menu',
  imports: [
    RouterLink,
    DecimalPipe,
    FormsModule,
    MatIconModule
  ],
  templateUrl: './restaurateur-menu.html',
  styleUrl: './restaurateur-menu.css'
})
export class RestaurateurMenu implements OnInit {
  restaurantId = 0;
  dishes: Dish[] = [];

  restaurant: RestaurantInfo | null = null;

  restaurantName = '';
  restaurantDescription = '';
  restaurantAddress = '';
  restaurantPhoneNumber = '';

  editingDishId: number | null = null;

  name = '';
  description = '';
  price = 0;
  imageUrl = 'https://example.com/image.jpg';
  categoryId = 5;

  isLoading = true;
  errorMessage = '';
  successMessage = '';

  private readonly restaurantApiUrl = 'http://localhost:53477/api/Restaurants';

  constructor(
    private route: ActivatedRoute,
    private dishService: DishService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.restaurantId = Number(this.route.snapshot.paramMap.get('id'));

    this.loadRestaurant();
    this.loadDishes();
  }

  async loadRestaurant(): Promise<void> {
    this.errorMessage = '';

    try {
      const response = await fetch(`${this.restaurantApiUrl}/${this.restaurantId}`);

      if (!response.ok) {
        throw new Error('Restaurant introuvable.');
      }

      const restaurant = await response.json();

      this.restaurant = restaurant;
      this.restaurantName = restaurant.name;
      this.restaurantDescription = restaurant.description;
      this.restaurantAddress = restaurant.address;
      this.restaurantPhoneNumber = restaurant.phoneNumber;

      this.cdr.detectChanges();
    } catch (error) {
      this.errorMessage = 'Impossible de charger les informations du restaurant.';
      this.cdr.detectChanges();
    }
  }

  async saveRestaurant(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.restaurantName.trim() ||
      !this.restaurantDescription.trim() ||
      !this.restaurantAddress.trim() ||
      !this.restaurantPhoneNumber.trim()
    ) {
      this.errorMessage = 'Tous les champs du restaurant sont obligatoires.';
      this.cdr.detectChanges();
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(this.restaurantPhoneNumber)) {
      this.errorMessage = 'Le téléphone du restaurant doit contenir exactement 10 chiffres.';
      this.cdr.detectChanges();
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      this.errorMessage = 'Vous devez être connecté pour modifier le restaurant.';
      this.cdr.detectChanges();
      return;
    }

    const payload = {
      name: this.restaurantName.trim(),
      description: this.restaurantDescription.trim(),
      address: this.restaurantAddress.trim(),
      phoneNumber: this.restaurantPhoneNumber.trim()
    };

    try {
      const response = await fetch(`${this.restaurantApiUrl}/${this.restaurantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Modification échouée.');
      }

      const updatedRestaurant = await response.json();

      this.restaurant = updatedRestaurant;
      this.restaurantName = updatedRestaurant.name;
      this.restaurantDescription = updatedRestaurant.description;
      this.restaurantAddress = updatedRestaurant.address;
      this.restaurantPhoneNumber = updatedRestaurant.phoneNumber;

      this.successMessage = 'Informations du restaurant modifiées avec succès.';
      this.cdr.detectChanges();
    } catch (error) {
      this.errorMessage = 'Impossible de modifier les informations du restaurant.';
      this.cdr.detectChanges();
    }
  }

  loadDishes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.dishService.getDishesByRestaurant(this.restaurantId).subscribe({
      next: (dishes) => {
        this.dishes = dishes;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les plats.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  async saveDish(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.name.trim() || !this.description.trim() || this.price <= 0) {
      this.errorMessage = 'Veuillez remplir correctement le nom, la description et le prix.';
      this.cdr.detectChanges();
      return;
    }

    const dish: DishCreate = {
      name: this.name.trim(),
      description: this.description.trim(),
      price: Number(this.price),
      imageUrl: this.imageUrl.trim(),
      restaurantId: this.restaurantId,
      categoryId: Number(this.categoryId)
    };

    try {
      if (this.editingDishId === null) {
        await this.dishService.createDish(dish);
        this.successMessage = 'Plat ajouté avec succès.';
      } else {
        await this.dishService.updateDish(this.editingDishId, dish);
        this.successMessage = 'Plat modifié avec succès.';
      }

      this.resetForm();
      this.loadDishes();
      this.cdr.detectChanges();
    } catch (error) {
      this.errorMessage = this.editingDishId === null
        ? 'Impossible d’ajouter le plat.'
        : 'Impossible de modifier le plat.';

      this.cdr.detectChanges();
    }
  }

  startEdit(dish: Dish): void {
    this.editingDishId = dish.id;

    this.name = dish.name;
    this.description = dish.description;
    this.price = dish.price;
    this.imageUrl = dish.imageUrl;
    this.categoryId = dish.categoryId;

    this.successMessage = '';
    this.errorMessage = '';

    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.cdr.detectChanges();
  }

  cancelEdit(): void {
    this.resetForm();
    this.cdr.detectChanges();
  }

  resetForm(): void {
    this.editingDishId = null;

    this.name = '';
    this.description = '';
    this.price = 0;
    this.imageUrl = 'https://example.com/image.jpg';
    this.categoryId = 5;
  }

  async deleteDish(id: number): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    const confirmed = confirm('Voulez-vous vraiment supprimer ce plat ?');

    if (!confirmed) {
      return;
    }

    try {
      await this.dishService.deleteDish(id);

      if (this.editingDishId === id) {
        this.resetForm();
      }

      this.successMessage = 'Plat supprimé avec succès.';
      this.loadDishes();
      this.cdr.detectChanges();
    } catch (error) {
      this.errorMessage = 'Impossible de supprimer le plat.';
      this.cdr.detectChanges();
    }
  }
}