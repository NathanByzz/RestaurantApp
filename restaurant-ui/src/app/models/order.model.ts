export interface OrderItem {
  dishId: number;
  dishName?: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
}

export interface Order {
  id: number;
  createdAt: string;
  status: string;
  totalAmount: number;
  deliveryAddress: string;

  clientId: number;
  clientName?: string;
  clientPhoneNumber?: string;

  restaurantId: number;
  restaurantName?: string;

  deliveryPersonId?: number | null;
  deliveryPersonName?: string | null;

  items: OrderItem[];
}