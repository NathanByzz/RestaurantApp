export interface DishCreate {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  restaurantId: number;
  categoryId: number;
}