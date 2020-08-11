import {Component, OnInit} from '@angular/core';
import {ProductListService} from '../../services/product-list.service';
import {HttpParams} from '@angular/common/http';
import {ShoppingCartListService} from '../../services/shopping-cart-list.service';
import {Product} from '../../models/product';
import {CartProduct} from '../../models/cart-product';
import {UserListService} from '../../services/user-list.service';
import {User} from '../../models/user';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  productPage: ProductPage;
  totalPages: number;
  productList: ProductItem[];
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
  cartProductIdList: string[];
  userId: number;
  user: User;


  constructor(
    private productListService: ProductListService,
    private shoppingCartListService: ShoppingCartListService,
    private userListService: UserListService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // Product list
    this.getProductsByCategory(this.category);

    // User list and cart product list
    this.userId = this.authService.getUserId();
    this.cartProductIdList = this.shoppingCartListService.getCartProductIdFromSessionStorage();

    if (this.userId) {
      this.shoppingCartListService.getCartProductByUserId(this.userId).subscribe(
        response => {
          this.cartProductList = response;
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
          response => this.cartProductList = response
        );
      }
    }
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

    const params = this.getHttpParams();

    this.productListService.getProductPageByCategory(category, params).subscribe(
      response => {
        this.productPage = response;
        this.totalPages = response.totalPages;
        this.productList = this.getProductList(response.content);
        this.getPageRange(0);
      }
      // , error => console.error(error),
      // () => this.getPageRange(0)
    );

    this.updateBrandListAndPriceRange(category, params);
  }

  updateBrandListAndPriceRange(category, httpParams) {
    // renew brandList
    this.productListService.getBrandList(category, httpParams).subscribe(
      response => {
        this.brandList = response;
      }
    );
    // renew price range
    this.productListService.getPriceRange(category, httpParams).subscribe(
      response => {
        this.minValue = response[0];
        this.maxValue = response[1];
      }
    );
  }

  getProductList(products) {
    let productList = [];
    for (const prod of products) {
      this.productListService.getProductImageURLByImagePath(prod.imagePath).subscribe(
        resp => productList.push({product: prod, imageURL: resp })
      );
    }
    return productList;
  }

  getProductByCategoryAndSort() {
    const params = this.getHttpParams();
    this.productListService.getProductPageByCategoryAndSort(this.category, params).subscribe(
      response => {
        this.productPage = response;
        this.productList = this.getProductList(response.content);
        this.getPageRange(this.pageNo);
      }
    );
    // this.updateBrandListAndPriceRange(this.category, params);
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
      if (cartProd.product.productId === addedProduct.productId) {
        const index = this.cartProductList.indexOf(cartProd);
        this.cartProductList[index].quantity = ++cartProd.quantity;
        this.shoppingCartListService.updateCartProduct(this.cartProductList[index]).subscribe();
        isExist = true;
        break;
      }
    }

    if (!isExist) {
      const newCartProduct: CartProduct = {cartId: null, user: this.user, product: addedProduct, quantity: 1};
      this.shoppingCartListService.addNewCartProduct(newCartProduct).subscribe(
        response => {
          this.cartProductList.push(response);
          this.cartProductIdList.push(response.cartId.toString());
          this.shoppingCartListService.setCartProductIdInSessionStorage(this.cartProductIdList);
        }
      );
    }
  }
}

export interface ProductPage {
  content: Product[];
  totalPages: number;
  totalElements: number;
  number: number;
}

export interface ProductItem {
  product: Product;
  imageURL: string;
}


