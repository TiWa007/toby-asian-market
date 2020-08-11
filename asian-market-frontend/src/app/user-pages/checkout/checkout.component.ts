import { Component, OnInit } from '@angular/core';
import {ShoppingCartListService} from '../../services/shopping-cart-list.service';
import {User} from '../../models/user';
import {UserListService} from '../../services/user-list.service';
import {AuthService} from '../../services/auth/auth.service';
import {CartProduct} from '../../models/cart-product';
import {AddressListService} from '../../services/address-list.service';
import {Address} from '../../models/address';
import {OrderListService} from '../../services/order-list.service';
import {Order} from '../../models/order';
import {OrderItem} from '../../models/order-item';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  cartProductList: CartProduct[];
  userId: number;
  user: User;
  addressList: Address[];
  order: Order;

  constructor(
    private shoppingCartListService: ShoppingCartListService,
    private userListService: UserListService,
    private authService: AuthService,
    private addressListService: AddressListService,
    private orderListService: OrderListService
  ) { }

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.userListService.getUserByUserId(this.userId).subscribe(
      response => this.user = response
    );
    this.shoppingCartListService.getCartProductByUserId(this.userId).subscribe(
      response => this.cartProductList = response
    );
    this.addressListService.getAddressByUserId(this.userId).subscribe(
      response => {
        this.addressList = response;
      }
    );
    this.order = new Order();
  }

  totalcost() {
    let sum = 0;
    for (const cartProduct of this.cartProductList) {
      sum += cartProduct.product.price * cartProduct.quantity;
    }
    this.order.amount = sum;
    return sum;
  }

  addNewAddress() {
    console.log('Add new address');
  }

  chooseAddress(index: number) {
    this.order.address = this.addressList[index];
  }

  addNewOrder() {
    this.order.user = this.user;
    this.order.createDate = new Date();
    this.order.isPaid = 0;
    this.order.isDeliveried = 0;
    console.log(this.order);
    this.orderListService.addOrder(this.order).subscribe(
      response => {
        this.order = response;
        this.addNewOrderItems();
      }
    )
  }

  addNewOrderItems() {
    for (let cartProduct of this.cartProductList) {
      let orderItem = new OrderItem();
      orderItem.quantity = cartProduct.quantity;
      orderItem.product = cartProduct.product;
      orderItem.order = this.order;
      console.log(orderItem);
      this.orderListService.addOrderItem(orderItem).subscribe();
    }
    this.emptyShoppingCart();

  }

  emptyShoppingCart() {
    this.shoppingCartListService.setCartProductIdInSessionStorage([]);
    this.shoppingCartListService.deleteAllCartProductByUserId(this.userId).subscribe();
  }

}
