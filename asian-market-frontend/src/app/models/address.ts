import {User} from './user';

export class Address {
  addressId: number;
  fullName: string; // length = 255
  country: string; // length = 255
  postcode: string; // length = 10
  addressLine1: string; // length = 255
  addressLine2: string; // length = 255
  city: string; // length = 255
  phoneNumber: string; // length = 40
  user: User;
}
