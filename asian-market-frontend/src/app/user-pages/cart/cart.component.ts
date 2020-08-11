import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {User} from '../../models/user';
import {ShoppingCartListService} from '../../services/shopping-cart-list.service';
import {CartProductItem} from '../../transaction-pages/shopping-cart/shopping-cart.component';
import {ProductListService} from '../../services/product-list.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnChanges {

  @Input() user: User;
  cartProductItemList: CartProductItem[] = [];
  cartProductIdList: string[];

  constructor(
    private shoppingCartListService: ShoppingCartListService,
    private productListService: ProductListService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.user ) {
      this.cartProductIdList = [];
      this.shoppingCartListService.getCartProductByUserId(this.user.userId).subscribe(
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
