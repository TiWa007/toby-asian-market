import {Component, Input, OnInit} from '@angular/core';
import {Order} from '../../models/order';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {getMatIconFailedToSanitizeLiteralError} from '@angular/material';
import {OrderListService} from '../../services/order-list.service';
import {OrderItem} from '../../models/order-item';

@Component({
  selector: 'app-order-edit-modal',
  templateUrl: './order-edit-modal.component.html',
  styleUrls: ['./order-edit-modal.component.css']
})
export class OrderEditModalComponent implements OnInit {

  @Input() order: Order;
  @Input() isEdit: boolean;

  payStatus = ['Paid', 'Pending'];
  deliveryStatus = ['Deliveried', 'Pending'];
  isChanged = false;
  changedItemQuantityList: number[];

  constructor(
    public activeModal: NgbActiveModal,
    public orderListService: OrderListService
  ) { }

  ngOnInit() {
  }

  update(form) {

    let isOrderChanged = false;
    if (this.changedItemQuantityList) {
      for (let i = 0; i < this.changedItemQuantityList.length; i++) {
        if (this.changedItemQuantityList[i]) {
          this.order.orderItemSet[i].quantity = this.changedItemQuantityList[i];
          this.orderListService.updateOrderItem(this.duplicate(this.order.orderItemSet[i])).subscribe();
        }
      }
      if (this.getTotalCost() !== this.order.amount) {
        this.order.amount = this.getTotalCost();
        isOrderChanged = true;
      }
    }

    if (form.controls['payment'].value !== this.getPayStatus()) {
      this.order.isPaid = form.controls['payment'].value === this.payStatus[0] ? 1 : 0;
      isOrderChanged = true;
    }

    if (form.controls['delivery'].value !== this.getDeliveryStatus()) {
      this.order.isDeliveried = form.controls['delivery'].value === this.deliveryStatus[0] ? 1 : 0;
      this.order.deliveryDate = new Date();
      isOrderChanged = true;
    }

    if (form.controls['note'].value) this.order.note = form.controls['note'].value;

    this.order.updateDate = new Date();
    console.log(this.order);

    if (isOrderChanged) this.orderListService.updateOrder(this.order).subscribe();

    this.cancel();
  }

  duplicate(orderItem: OrderItem): OrderItem {
    let item = new OrderItem();
    item.id = orderItem.id;
    item.product = orderItem.product;
    item.order = this.order;
    item.quantity = orderItem.quantity;
    return item;
  }

  getPayStatus() {
    return this.order.isPaid === 1 ? this.payStatus[0] : this.payStatus[1];
  }

  getDeliveryStatus() {
    return this.order.isDeliveried === 1 ? this.deliveryStatus[0] : this.deliveryStatus[1];
  }

  changeStatus() {
    this.isChanged = true;
  }

  changeQuantity(event, index) {
    if(!this.changedItemQuantityList) this.changedItemQuantityList = new Array(this.order.orderItemSet.length);
    // this.order.orderItemSet[index].quantity = event;
    this.changedItemQuantityList[index] = event;
    this.isChanged = true;
    console.log(this.changedItemQuantityList);
  }

  getItemNumber() {
    return this.order.orderItemSet ? this.order.orderItemSet.length : 0;
  }

  getTotalCost() {
    let sum = 0;
    for (let orderIt of this.order.orderItemSet) {
      sum += orderIt.quantity * orderIt.product.price;
    }
    return sum;
  }

  edit() {
    this.isEdit = true;
  }

  cancel() {
    this.changedItemQuantityList = [];
    this.isEdit = false;
  }

}
