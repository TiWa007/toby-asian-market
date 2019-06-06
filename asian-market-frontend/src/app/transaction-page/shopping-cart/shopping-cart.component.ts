import { Component, OnInit } from '@angular/core';
import {CartProduct} from '../../pages-static/product-list/product-list.component';
import {ShoppingCartListService} from '../../services/shopping-cart-list.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  cartProductList: CartProduct[] = [];

  constructor(private shoppingCartListService: ShoppingCartListService) {

  }

  ngOnInit() {
    this.shoppingCartListService.currentCartList.subscribe(response => this.cartProductList = response);
  }

  totalPrice() {
    let totalPrice = 0;
    for (const cartProd of this.cartProductList) {
      totalPrice = totalPrice + cartProd.amount * cartProd.product.price;
    }
    return totalPrice;
  }

  deleteCartProduct(index) {
    if (index < this.cartProductList.length) {
      this.cartProductList.splice(index, 1);
    }
  }

  changeAmount(changedAmount: number, index: number) {
    const cartProd = this.cartProductList[index];
    const newAmount = cartProd.amount + changedAmount;
    if (newAmount === 0) {
      this.deleteCartProduct(index);
    } else {
      this.cartProductList[index] = {product: cartProd.product, amount: newAmount};
    }
  }

  show() {
    console.log(this.cartProductList);
  }

}
