import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse, HttpParams, HttpHeaders} from '@angular/common/http';
import {ProductPage} from '../static-pages/product-list/product-list.component';
import {commonURI} from '../../environments/environment';
import {Product} from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductListService {

  constructor(
    private http: HttpClient
  ) { }

  // GET
  getProductPageByCategory(category, params) {
    return this.http.get<ProductPage>(`${commonURI.backendURI}/products/${category}`, {params});
  }

  getProductPageByCategoryAndSort(category, params) {
    return this.http.get<ProductPage>(`${commonURI.backendURI}/products/${category}/find`, {params});
  }

  getPriceRange(category, params) {
    return this.http.get<number[]>(`${commonURI.backendURI}/products/${category}/pricerange`, {params});
  }

  getBrandList(category, params) {
    return this.http.get<string[]>(`${commonURI.backendURI}/products/${category}/brandlist`, {params});
  }

  getProductDetailById(productId) {
    return this.http.get<Product>(`${commonURI.backendURI}/products/detail/${productId}`);
  }

  getProductImageURLByImagePath(imagePath) {
    return this.http.get(`${commonURI.backendURI}/products/image/${imagePath}`, {responseType: 'text'});
  }

  // UPDATE Product
  updateProductDetailById(productId, product) {
    return this.http.put<Product>(`${commonURI.backendURI}/products/detail/${productId}`, product);
  }

  // UPDATE ProductList
  updateProductList(productList) {
    return this.http.put<Product[]>(`${commonURI.backendURI}/productList/detail`, productList);
  }

  // Update Product Image
  updateProductImage(imageURL, imagePath) {
    return this.http.put<string>(`${commonURI.backendURI}/products/image/${imagePath}`, imageURL);
  }

  // Delete Product
  deleteProduct(productId) {
    return this.http.delete<string>(`${commonURI.backendURI}/products/delete/${productId}`);
  }

}
