import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserPagesRoutingModule } from './user-pages-routing.module';
import {UserHomeComponent} from './user-home/user-home.component';
import {InformationComponent} from './information/information.component';
import {OrderComponent} from './order/order.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CartComponent } from './cart/cart.component';
import { AddressComponent } from './address/address.component';
import { CheckoutComponent } from './checkout/checkout.component';

@NgModule({
  declarations: [
    UserHomeComponent,
    InformationComponent,
    OrderComponent,
    CartComponent,
    AddressComponent,
    CheckoutComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    UserPagesRoutingModule,
    ReactiveFormsModule
  ]
})
export class UserPagesModule { }
