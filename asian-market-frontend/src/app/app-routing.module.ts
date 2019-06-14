import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProductListComponent} from './pages-static/product-list/product-list.component';
import {ErrorComponent} from './error/error.component';
import {ContactComponent} from './pages-static/contact/contact.component';
import {SignUpComponent} from './user-pages/sign-up/sign-up.component';
import {ShoppingCartComponent} from './transaction-pages/shopping-cart/shopping-cart.component';
import {ProductDetailComponent} from './pages-static/product-detail/product-detail.component';

const routes: Routes = [
  { path: '', component: ProductListComponent  },
  { path: 'contact', component: ContactComponent  },
  { path: 'signup', component: SignUpComponent  },
  { path: 'productDetail/:productId', component: ProductDetailComponent },
  { path: 'shoppingcart', component: ShoppingCartComponent  },
  { path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
