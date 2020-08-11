import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { StaticPagesRoutingModule } from './static-pages-routing.module';
import {ProductListComponent} from './product-list/product-list.component';
import {ContactComponent} from './contact/contact.component';
import {ProductDetailComponent} from './product-detail/product-detail.component';
import {ShoppingCartComponent} from '../transaction-pages/shopping-cart/shopping-cart.component';
import {LoginComponent} from './login/login.component';
import {SignUpComponent} from './sign-up/sign-up.component';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    ContactComponent,
    ShoppingCartComponent,
    LoginComponent,
    SignUpComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    StaticPagesRoutingModule,
    ReactiveFormsModule
  ]
})
export class StaticPagesModule { }
