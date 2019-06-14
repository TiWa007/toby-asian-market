import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse, HttpParams} from '@angular/common/http';
import {Product, ProductPage} from '../pages-static/product-list/product-list.component';
import {Observable} from 'rxjs';
import {commonURI} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductListService {

  constructor(
    private http: HttpClient
  ) { }


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

  getProductDetailById(id) {
    return this.http.get<Product>(`${commonURI.backendURI}/products/detail/${id}`);
  }

}
