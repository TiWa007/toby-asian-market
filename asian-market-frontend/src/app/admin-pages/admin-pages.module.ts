import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminPagesRoutingModule } from './admin-pages-routing.module';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { ProductsComponent } from './products/products.component';
import { ProductEditModalComponent } from './product-edit-modal/product-edit-modal.component';
import { OrderListComponent } from './order-list/order-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { FormsModule } from '@angular/forms';
import {NgbModalModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { OrderEditModalComponent } from './order-edit-modal/order-edit-modal.component';

@NgModule({
  declarations: [
    AdminHomeComponent,
    ProductsComponent,
    ProductEditModalComponent,
    OrderListComponent,
    UserListComponent,
    OrderEditModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModalModule,
    AdminPagesRoutingModule,
    NgbModule
  ],
  entryComponents: [
    ProductEditModalComponent,
    OrderEditModalComponent
  ]
})
export class AdminPagesModule { }
