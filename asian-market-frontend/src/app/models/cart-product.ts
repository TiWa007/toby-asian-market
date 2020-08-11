import {Product} from './product';
import {User} from './user';

export class CartProduct {
  cartId: number;
  user: User;
  product: Product;
  quantity: number;
}
