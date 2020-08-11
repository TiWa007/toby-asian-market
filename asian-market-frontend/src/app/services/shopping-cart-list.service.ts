import { Injectable } from '@angular/core';
import {commonURI} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {CartProduct} from '../models/cart-product';

export const CART_PRODUCT_ID = 'cartProductId';

@Injectable({
  providedIn: 'root'
})

export class ShoppingCartListService {

  // private cartList = new BehaviorSubject([]);
  // currentCartList = this.cartList.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  // changeCartList(cartList: CartProduct[]) {
  //   this.cartList.next(cartList);
  // }
  getCartProductById(cartId: number) {
    return this.http.get<CartProduct>(`${commonURI.backendURI}/products/cart/get/cartId/${cartId}`);
  }

  getCartProductByIdList(cartIdList: string) {
    return this.http.get<CartProduct[]>(`${commonURI.backendURI}/products/cart/get/cartIdList/${cartIdList}`);
  }

  getCartProductByUserId(userId: number) {
    return this.http.get<CartProduct[]>(`${commonURI.backendURI}/products/cart/get/userId/${userId}`);
  }

  updateCartProduct(cartProduct) {
    return this.http.put(`${commonURI.backendURI}/products/cart/update`, cartProduct);
  }

  updateCartProductQuantity(cartId, params) {
    return this.http.put(`${commonURI.backendURI}/products/cart/update/${cartId}`, params);
  }

  addNewCartProduct(cartProduct) {
    return this.http.post<CartProduct>(`${commonURI.backendURI}/products/cart/create`, cartProduct);
  }

  deleteCartProductByCartId(cartId: number) {
    return this.http.delete(`${commonURI.backendURI}/products/cart/delete/${cartId}`, {responseType: 'text'});
  }

  deleteAllCartProductByUserId(userId: number) {
    return this.http.delete(`${commonURI.backendURI}/products/cart/delete/user/${userId}`);
  }

//  SessionStorage

  // a string of the list of cartProductId is stored in the sessionStorage, seperated by ','
  // for example '1,3,5,23'.

  getCartProductIdFromSessionStorage() {
    const cartIds = sessionStorage.getItem(CART_PRODUCT_ID);
    if (cartIds) {
      const cartIdList = cartIds.split(',');
      return cartIdList;
    }
    return [];
  }

  setCartProductIdInSessionStorage(cartIdList) {
    sessionStorage.setItem(CART_PRODUCT_ID, cartIdList.toString());
  }
}
