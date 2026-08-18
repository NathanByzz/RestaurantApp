export interface OrderItemCreate {
  dishId: number;
  quantity: number;
}

export interface OrderCreate {
  clientId: number;
  restaurantId: number;
  deliveryAddress: string;
  items: OrderItemCreate[];
}