export interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  restaurantId: number;
  restaurantName?: string;
  categoryId: number;
  categoryName?: string;
}