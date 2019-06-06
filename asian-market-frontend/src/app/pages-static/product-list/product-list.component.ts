import {Component, OnInit} from '@angular/core';
import {ProductListService} from '../../services/product-list.service';
import {HttpParams} from '@angular/common/http';
import {ShoppingCartListService} from '../../services/shopping-cart-list.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  productPage: ProductPage;
  totalPages: number;
  productList: Product[];
  // Initial parameter obtained using getProductsByCategory(category)
  // Price range
  minValue: number;
  maxValue: number;
  brandList: string[];

  // Sort parameters
  category = 'allProduct'; // ['allProduct', 'Sale', categories]
  searchKey: string;
  brand: string[];
  // User entered price range
  minPrice: string;
  maxPrice: string;
  sort: string;
  pageNo: number;

  // Pagination
  pagination: Array<number>;



  // communicate with shopping cart
  cartProductList: CartProduct[] = [];

  constructor(
    private productListService: ProductListService,
    private shoppingCartListService: ShoppingCartListService
  ) { }

  ngOnInit() {
    this.getProductsByCategory(this.category);
    this.shoppingCartListService.currentCartList.subscribe(response => this.cartProductList = response);
  }

  getProductsByCategory(category) {
    // renew productPage and productList

    this.category = category;
    this.pageNo = 0;
    if (category !== 'Search') { this.searchKey = null; }
    if (this.brand) { this.brand = null; }
    if (this.minPrice) { this.minPrice = null; }
    if (this.maxPrice) { this.maxPrice = null; }
    if (this.sort) { this.sort = null; }

    this.productListService.getProductPageByCategory(category, this.getHttpParams()).subscribe(
      response => {
        this.productPage = response;
        this.totalPages = response.totalPages;
        this.productList = response.content;
      }, error => console.error(error),
      () => this.getPageRange(0)
    );
    // renew brandList
    this.productListService.getBrandList(category, this.getHttpParams()).subscribe(
      response => {
        this.brandList = response;
      }
    );
    // renew price range
    this.productListService.getPriceRange(category, this.getHttpParams()).subscribe(
      response => {
        this.minValue = response[0];
        this.maxValue = response[1];
      }
    );

  }

  getProductByCategoryAndSort() {
    this.productListService.getProductPageByCategoryAndSort(this.category, this.getHttpParams()).subscribe(
      response => {
        this.productPage = response;
        this.productList = response.content;
      },
      error => console.error(error),
      () => {
        console.log(this.productList);
        this.getPageRange(this.pageNo);
      }
    );
  }

  getHttpParams() {
    let params = new HttpParams();
    if (this.searchKey) {
      params = params.set('searchKey', this.searchKey);
    }
    if (this.brand) {
      params = params.set('brand', this.brand.toString());
    }
    if (this.minPrice) { params = params.set('minPrice', this.minPrice); }
    if (this.maxPrice) { params = params.append('maxPrice', this.maxPrice); }
    if (this.sort) { params = params.set('sort', this.sort); }

    if (this.pageNo) { params = params.set('pageNo', this.pageNo.toString()); }
    // console.log(params.toString());
    return params;
  }

  setPriceRange(minPrice, maxPrice) {
    if (minPrice) {
      this.minPrice = minPrice;
    } else {
      this.minPrice = null;
    }

    if (maxPrice) {
      this.maxPrice = maxPrice;
    } else {
      this.maxPrice = null;
    }

    this.pageNo = 0;
    this.getProductByCategoryAndSort();
  }

  setBrand(brand) {
    if (!this.brand) { this.brand = []; }

    if (this.brand.includes(brand)) {
      this.brand.splice(this.brand.indexOf(brand), 1);
    } else {
      this.brand.push(brand);
    }
    if (this.brand.length === 0) {
      this.brand = null;
    }

    this.pageNo = 0;
    this.getProductByCategoryAndSort();
  }

  setSort(sortPara) {
    this.sort = sortPara;
    this.pageNo = 0;
    this.getProductByCategoryAndSort();
  }


  getPageRange(page) {
    const totalPages = this.productPage.totalPages;
    this.pagination = new Array<number>();
    let low = (page > 2 ? page - 2 : 0);
    let high = (page + 2 > totalPages - 1 ? totalPages - 1 : page + 2);
    if ( high < 4 ) {
      high = (totalPages >= 5 ? 4 : totalPages - 1);
    }
    if ( high > totalPages - 3) {
      low = (high - 4 >= 0 ? high - 4 : 0);
    }
    for (let index = low; index <= high; index++) {
      this.pagination.push(index);
    }
  }

  setPage(page) {
    if (page <= 0) {
      this.pageNo = 0;
    } else if (page <= this.productPage.totalPages - 1) {
      this.pageNo = page;
    } else {
      this.pageNo = this.productPage.totalPages - 1;
    }

    this.getProductByCategoryAndSort();

  }

  // Shopping cart
  addToCart(addedProduct) {

    let isExist = false;

    for (const cartProd of this.cartProductList) {
      if (cartProd.product === addedProduct) {
        const index = this.cartProductList.indexOf(cartProd);
        this.cartProductList[index] = {product: cartProd.product, amount: (++cartProd.amount)};
        isExist = true;
        break;
      }
    }

    if (!isExist) {
      this.cartProductList.push({product: addedProduct, amount: 1});
    }

    this.shoppingCartListService.changeCartList(this.cartProductList);
  }

  test() {
    this.shoppingCartListService.changeCartList(this.cartProductList);
  }

  show() {
    this.shoppingCartListService.currentCartList.subscribe(response => console.log(response));
  }
}

export interface ProductPage {
  content: Product[];
  totalPages: number;
  totalElements: number;
  number: number;
}

export interface Product {
  productId: number;
  name: string;
  category: string;
  description: string;
  brand: string;
  price: number;
  isSale: number;
  salePercentage: number;
  imagePath: string;
}

export interface CartProduct {
  product: Product;
  amount: number;
}
