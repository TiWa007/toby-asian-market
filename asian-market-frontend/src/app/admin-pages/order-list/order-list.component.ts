import {Component, Input, OnInit} from '@angular/core';
import {OrderListService} from '../../services/order-list.service';
import {Order} from '../../models/order';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {OrderEditModalComponent} from '../order-edit-modal/order-edit-modal.component';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

  orderList: Order[];

  constructor(
    private orderListService: OrderListService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.orderListService.getOrderList().subscribe(
      response => {
        this.orderList = response;
      }
    );
  }

  getDeliveryStatus(index: number): string {
    return this.orderList[index].isDeliveried ? 'Deliveried' : 'Pending';
  }

  getTotalOrderNumber() {
    return this.orderList ? this.orderList.length : 0;
  }

  editInformation(index: number, edit: boolean) {
    const modalRef = this.modalService.open(OrderEditModalComponent);
    modalRef.componentInstance.order = this.orderList[index];
    modalRef.componentInstance.isEdit = edit;
  }


}
