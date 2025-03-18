export interface OrderItem {
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
  };
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
}