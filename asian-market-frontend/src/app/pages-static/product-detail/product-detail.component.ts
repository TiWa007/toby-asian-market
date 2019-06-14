import { Component, OnInit } from '@angular/core';
import {ProductListService} from '../../services/product-list.service';
import {ShoppingCartListService} from '../../services/shopping-cart-list.service';
import {ActivatedRoute} from '@angular/router';
import {CartProduct, Product} from '../product-list/product-list.component';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  product: Product;
  cartProductList: CartProduct[] = [];
  amount: number;

  constructor(
    private productListService: ProductListService,
    private shoppingCartListService: ShoppingCartListService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.shoppingCartListService.currentCartList.subscribe(
      response => this.cartProductList = response
      );
    this.getProductDetail();
  }

  getProductDetail(): void {
     const productId = +this.route.snapshot.paramMap.get('productId');
     console.log(productId);
     this.productListService.getProductDetailById(productId).subscribe(
      response => this.product = response,
       error => console.log(error),
       () => this.amount = this.getProductAmount(productId)
     );
  }

  addToCart() {
    const index = this.findProductIndex(this.product.productId);
    if (index === -1) {
      this.cartProductList.push({product: this.product, amount: this.amount});
    } else {
      this.cartProductList[index].amount = this.amount;
    }

  }

  changeAmount(changedAmount: number): void {
    this.amount = this.amount + changedAmount;
    if (this.amount < 1) { this.amount = 1; }
  }

  getProductAmount(productId: number): number {
    const index = this.findProductIndex(productId);
    if (index === -1) {
      return 1;
    }
    return this.cartProductList[index].amount;
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

}
