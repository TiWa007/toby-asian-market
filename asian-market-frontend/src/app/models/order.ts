import {User} from './user';
import {Address} from './address';
import {OrderItem} from './order-item';

export class Order {
  orderId: number;
  user: User;
  address: Address;
  amount: number;
  isPaid: number;
  isDeliveried: number;
  userNote: string; // length = 1022
  createDate: Date;
  updateDate: Date;
  deliveryDate: Date;
  note: string; // length = 1022
  orderItemSet: OrderItem[];

}
