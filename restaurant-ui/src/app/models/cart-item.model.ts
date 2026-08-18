import { Dish } from './dish.model';

export interface CartItem {
  dish: Dish;
  quantity: number;
}