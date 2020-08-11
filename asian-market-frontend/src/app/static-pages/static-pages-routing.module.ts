import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProductListComponent} from './product-list/product-list.component';
import {ContactComponent} from './contact/contact.component';
import {ProductDetailComponent} from './product-detail/product-detail.component';
import {ShoppingCartComponent} from '../transaction-pages/shopping-cart/shopping-cart.component';
import {LoginComponent} from './login/login.component';
import {SignUpComponent} from './sign-up/sign-up.component';

const staticRoutes: Routes = [
  { path: 'home', component: ProductListComponent },
  { path: 'product/:productId', component: ProductDetailComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'shoppingcart', component: ShoppingCartComponent  },
  { path: 'login', component: LoginComponent  },
  { path: 'signup', component: SignUpComponent  },
  { path: '', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(staticRoutes)],
  exports: [RouterModule]
})
export class StaticPagesRoutingModule { }
