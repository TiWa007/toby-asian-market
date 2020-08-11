import {Address} from './address';
import {Order} from './order';

export class User {
  userId: number;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  isAdmin: number;
  createTime: Date;
  addressSet: Address[];
  // orders: Order[];
}
