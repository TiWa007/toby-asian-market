import { Component, OnInit } from '@angular/core';
import {ProductListService} from '../../services/product-list.service';
import {ShoppingCartListService} from '../../services/shopping-cart-list.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {ProductItem} from '../product-list/product-list.component';
import {CartProduct} from '../../models/cart-product';
import {User} from '../../models/user';
import {UserListService} from '../../services/user-list.service';
import {AuthService} from '../../services/auth/auth.service';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  productItem: ProductItem;
  productId: number;
  amount: number;

  imageUrl: string;

  // communicate with shopping cart
  cartProductList: CartProduct[] = [];
  cartProductIdList: string[];
  userId: number;
  user: User;

  constructor(
    private productListService: ProductListService,
    private shoppingCartListService: ShoppingCartListService,
    private userListService: UserListService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private route: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(
      (params: ParamMap) => {
        const id = params.get('productId');
        if (id === null) {
          this.route.navigateByUrl('/home');
        } else {
          this.productId = +id;
          this.productListService.getProductDetailById(this.productId).subscribe(
            response => {
              this.productItem = {product: response, imageURL: '' };
              this.productListService.getProductImageURLByImagePath(this.productItem.product.imagePath).subscribe(
                resp => this.productItem.imageURL = resp
              );
            }
          );
        }
      }
    );

    this.amount = 1;

    // user and cart product list

    this.userId = this.authService.getUserId();
    this.cartProductIdList = this.shoppingCartListService.getCartProductIdFromSessionStorage();

    if (this.userId) {
      this.shoppingCartListService.getCartProductByUserId(this.userId).subscribe(
        response => {
          this.cartProductList = response;
          this.amount = this.getProductAmount(this.productId);
          for (const carProduct of response) {
            this.cartProductIdList.push(carProduct.cartId.toString());
          }
          if (this.cartProductIdList.length !== 0) {
            this.shoppingCartListService.setCartProductIdInSessionStorage(this.cartProductIdList.toString());
          }
        });
      this.userListService.getUserByUserId(this.userId).subscribe(
        response => this.user = response
      );
    } else {
      this.user = null;
      if (this.cartProductIdList.length !== 0) {
        this.shoppingCartListService.getCartProductByIdList(this.cartProductIdList.toString()).subscribe(
          response => {
            this.cartProductList = response;
            this.amount = this.getProductAmount(this.productId);
          }
        );
      }
    }
  }

  getProductAmount(productId: number): number {
    const index = this.findProductIndex(productId);
    if (index === -1) {
      return 1;
    }
    return this.cartProductList[index].quantity;
  }

  addToCart() {
    const index = this.findProductIndex(this.productItem.product.productId);
    if (index === -1) {
      const newCartProduct = {cartId: null, user: this.user, product: this.productItem.product, quantity: this.amount};
      this.shoppingCartListService.addNewCartProduct(newCartProduct).subscribe(
        response => {
          this.cartProductList.push(response);
          this.cartProductIdList.push(response.cartId.toString());
          this.shoppingCartListService.setCartProductIdInSessionStorage(this.cartProductIdList);
        }
      );

    } else {
      this.cartProductList[index].quantity = this.amount;
      this.shoppingCartListService.updateCartProduct(this.cartProductList[index]).subscribe();
    }

  }

  changeAmount(changedAmount: number): void {
    this.amount = this.amount + changedAmount;
    if (this.amount < 1) { this.amount = 1; }
  }

  findProductIndex(productId: number): number {
    let index = 0;
    for (const p of this.cartProductList) {
      if (p.product.productId === productId) {
        return index;
      }
      index++;
    }
    return -1;
  }

  uploadImage(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader(); // HTML5 FileReader API
      const file = event.target.files[0];
      const pattern = /image-*/;

      if (!file.type.match(pattern)) {
        alert('invalid format');
        return;
      }
      reader.readAsDataURL(file);
      reader.onload = () => {
        // called once readAsDataURL is completed
        this.imageUrl = reader.result.toString();
      };
    }
  }

}
