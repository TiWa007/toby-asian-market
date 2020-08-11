import {Product} from './product';
import {Order} from './order';

export class OrderItem {
  id: number;
  order: Order;
  product: Product;
  quantity: number;
}
