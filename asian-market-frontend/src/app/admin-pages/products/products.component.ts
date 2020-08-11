import { Component, OnInit } from '@angular/core';
import {ProductListService} from '../../services/product-list.service';
import {HttpParams} from '@angular/common/http';
import {ProductItem, ProductPage} from '../../static-pages/product-list/product-list.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ProductEditModalComponent} from '../product-edit-modal/product-edit-modal.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  productPage: ProductPage;
  totalPages: number;
  productList: ProductItem[];
  totalNumber: number;

  // Sort parameters
  category = 'allProduct'; // ['allProduct', 'Sale', categories]
  pageNo: number;

  // Pagination
  pagination: Array<number>;

  changedProductIndexs: number[] = [];

  constructor(
    private productListService: ProductListService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.getProductsByCategory(this.category);
  }

  getProductsByCategory(category) {
    // renew productPage and productList

    this.category = category;
    this.pageNo = 0;

    this.productListService.getProductPageByCategory(category, this.getHttpParams()).subscribe(
      response => {
        this.productPage = response;
        this.totalPages = response.totalPages;
        this.totalNumber = response.totalElements;
        this.productList = this.getProductList(response.content);
        this.getPageRange(0);
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
    this.productListService.getProductPageByCategoryAndSort(this.category, this.getHttpParams()).subscribe(
      response => {
        this.productPage = response;
        this.productList = this.getProductList(response.content);
        this.getPageRange(this.pageNo);
      }
    );
  }

  getHttpParams() {
    let params = new HttpParams();

    if (this.pageNo) { params = params.set('pageNo', this.pageNo.toString()); }

    return params;
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

  // Delete Button
  deleteProduct(product) {
    this.productListService.deleteProduct(product.product.productId).subscribe(
      resp => this.getProductByCategoryAndSort()
    );
  }

  // Update Button
  updateProductList() {
    for (const index of this.changedProductIndexs) {
      const prod = this.productList[index].product;
      this.productListService.updateProductDetailById(prod.productId, prod).subscribe();
    }
    this.changedProductIndexs = [];
  }

  changeIsSale(event, index) {
    this.productList[index].product.isSale =  event.target.checked ? 1 : 0;
    this.changeIndexArray(index);
  }

  changeQuantity(event, index) {
    this.productList[index].product.quantity = event;
    this.changeIndexArray(index);
  }

  changeSalePec(event, index) {
    this.productList[index].product.salePercentage = event;
    this.changeIndexArray(index);
  }

  changeIndexArray(index) {
    if (!this.changedProductIndexs.includes(index)) {
      this.changedProductIndexs.push(index);
    }
  }

  addProduct() {
    let newProduct = { name: '', category: '', description: '', brand: '', price: null, isSale: 0, salePercentage: 100, quantity: null, imagePath: ''};
    let newProductItem = {product: newProduct, imageURL: ''};

    const modalRef = this.modalService.open(ProductEditModalComponent);

    modalRef.componentInstance.productItem = newProductItem;

    modalRef.result.then((result) => {
      this.productList.push(result);
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }


  openFormModal(productItem, index) {
    const modalRef = this.modalService.open(ProductEditModalComponent);

    modalRef.componentInstance.productItem = productItem;

    modalRef.result.then((result) => {
      this.productList[index] = result;
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }

}
