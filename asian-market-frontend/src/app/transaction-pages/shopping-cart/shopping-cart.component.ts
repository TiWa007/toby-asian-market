import { Component, OnInit } from '@angular/core';
import {ShoppingCartListService} from '../../services/shopping-cart-list.service';
import {ProductListService} from '../../services/product-list.service';
import {UserListService} from '../../services/user-list.service';
import {User} from '../../models/user';
import {CartProduct} from '../../models/cart-product';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  // communicate with shopping cart
  cartProductItemList: CartProductItem[] = [];
  userId: number;
  user: User;
  cartProductIdList: string[];

  constructor(
    private shoppingCartListService: ShoppingCartListService,
    private productListService: ProductListService,
    private userListService: UserListService,
    private authService: AuthService
    ) { }

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.cartProductIdList = this.shoppingCartListService.getCartProductIdFromSessionStorage();

    if (this.userId != null) {
      this.userListService.getUserByUserId(this.userId).subscribe(
        response => this.user = response
      );
      this.cartProductIdList = [];
      this.shoppingCartListService.getCartProductByUserId(this.userId).subscribe(
        response => {
          this.cartProductItemList = this.getCartProductList(response);
          for (const prod of response) {
            this.cartProductIdList.push(prod.cartId.toString());
          }
          if (this.cartProductIdList.length !== 0) {
            this.shoppingCartListService.setCartProductIdInSessionStorage(this.cartProductIdList.toString());
          }
        }
      );
    } else {
      this.user = null;
      if (this.cartProductIdList.length !== 0) {
        this.shoppingCartListService.getCartProductByIdList(this.cartProductIdList.toString()).subscribe(
          response => {
            this.cartProductItemList = this.getCartProductList(response);
          }
        );
      }
    }
  }

  getCartProductList(cartProducts) {
    const cartProductList = [];
    for (const prod of cartProducts) {
      this.productListService.getProductImageURLByImagePath(prod.product.imagePath).subscribe(
        resp => cartProductList.push({cartProduct: prod, imageURL: resp })
      );
    }
    return cartProductList;
  }

  // getProductImage(cartProduct) {
  //   this.productListService.getProductImageURLByImagePath(cartProduct.product.imagePath).subscribe(
  //     resp => {
  //       console.log(resp);
  //       return resp.toString();
  //     });
  // }

  totalPrice() {
    let totalPrice = 0;
    for (const cartProd of this.cartProductItemList) {
      totalPrice = totalPrice + cartProd.cartProduct.quantity * cartProd.cartProduct.product.price;
    }
    return totalPrice;
  }

  deleteCartProduct(index) {
    if (index < this.cartProductItemList.length) {
      const deteltedProduct = this.cartProductItemList[index].cartProduct;
      this.cartProductItemList.splice(index, 1);
      this.cartProductIdList.splice(index, 1);
      this.shoppingCartListService.setCartProductIdInSessionStorage(this.cartProductIdList);
      this.shoppingCartListService.deleteCartProductByCartId(deteltedProduct.cartId).subscribe();
    }
  }

  changeAmount(changedAmount: number, index: number) {
    const cartProd = this.cartProductItemList[index];
    const newAmount = cartProd.cartProduct.quantity + changedAmount;
    if (newAmount === 0) {
      this.deleteCartProduct(index);
    } else {
      this.cartProductItemList[index].cartProduct.quantity = newAmount;
      console.log(this.cartProductItemList[index]);
      this.shoppingCartListService.updateCartProduct(this.cartProductItemList[index].cartProduct).subscribe();
    }
  }
}

export interface CartProductItem {
  cartProduct: CartProduct;
  imageURL: string;
}

