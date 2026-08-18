import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Dish } from '../../models/dish.model';
import { DishService } from '../../services/dish.service';
import { DishCreate } from '../../models/dish-create.model';

@Component({
  selector: 'app-restaurateur-menu',
  imports: [FormsModule, RouterLink, DecimalPipe],
  templateUrl: './restaurateur-menu.html',
  styleUrl: './restaurateur-menu.css'
})
export class RestaurateurMenu implements OnInit {
  restaurantId = 0;
  dishes: Dish[] = [];

  editingDishId: number | null = null;

  name = '';
  description = '';
  price = 0;
  imageUrl = 'https://example.com/image.jpg';
  categoryId = 5;

  isLoading = true;
  errorMessage = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private dishService: DishService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.restaurantId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadDishes();
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

    if (!this.name || !this.description || this.price <= 0) {
      this.errorMessage = 'Veuillez remplir correctement le nom, la description et le prix.';
      this.cdr.detectChanges();
      return;
    }

    const dish: DishCreate = {
      name: this.name,
      description: this.description,
      price: Number(this.price),
      imageUrl: this.imageUrl,
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