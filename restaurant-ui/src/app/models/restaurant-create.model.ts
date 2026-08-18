export interface RestaurantCreate {
  name: string;
  description: string;
  address: string;
  phoneNumber: string;
  ownerId: number;
}