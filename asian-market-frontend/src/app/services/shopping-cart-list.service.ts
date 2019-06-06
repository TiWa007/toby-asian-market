import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {CartProduct} from '../pages-static/product-list/product-list.component';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartListService {

  private cartList = new BehaviorSubject([]);
  currentCartList = this.cartList.asObservable();

  constructor() { }

  changeCartList(cartList: CartProduct[]) {
    this.cartList.next(cartList);
  }

}
