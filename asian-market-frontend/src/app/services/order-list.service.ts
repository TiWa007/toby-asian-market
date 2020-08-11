import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Order} from '../models/order';
import {commonURI} from '../../environments/environment';
import {OrderItem} from '../models/order-item';

@Injectable({
  providedIn: 'root'
})
export class OrderListService {

  constructor(
    private http: HttpClient
  ) { }

  getOrderById(orderId: number) {
    return this.http.get<Order>(`${commonURI.backendURI}/order/${orderId}`);
  }

  getOrderList() {
    return this.http.get<Order[]>(`${commonURI.backendURI}/order/orderList/sort`);
  }

  getOrderByUserId(userId: number) {
    return this.http.get<Order[]>(`${commonURI.backendURI}/order/user/${userId}`);
  }

  updateOrder(order: Order) {
    return this.http.put(`${commonURI.backendURI}/order/update`, order);
  }

  addOrder(order: Order) {
    return this.http.post<Order>(`${commonURI.backendURI}/order/add`, order);
  }

  updateOrderItem(orderItem: OrderItem) {
    return this.http.put(`${commonURI.backendURI}/orderItem/update`, orderItem);
  }

  addOrderItem(orderItem: OrderItem) {
    return this.http.post(`${commonURI.backendURI}/orderItem/add`, orderItem);
  }

}
