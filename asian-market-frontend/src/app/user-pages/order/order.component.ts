import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {OrderListService} from '../../services/order-list.service';
import {User} from '../../models/user';
import {Order} from '../../models/order';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, OnChanges {

  constructor(
    private orderListService: OrderListService
  ) { }

  @Input() user: User;
  orderList: Order[];

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.user ) {
      this.orderListService.getOrderByUserId(this.user.userId).subscribe(
        response => {
          this.orderList = response;
        }
      );
    }
  }

  getOrderStatus(order: Order) {
    return order.isDeliveried ? 'Delivered' : 'In progress';
  }

  getQuantity(order: Order) {
    let sum = 0;
    for (let i of order.orderItemSet) {
      sum += i.quantity;
    }
    return sum;
  }

}
