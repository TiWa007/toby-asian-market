import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UserHomeComponent} from './user-home/user-home.component';
import {CheckoutComponent} from './checkout/checkout.component';



const userRoutes: Routes = [
  { path: 'home', component: UserHomeComponent},
  { path: 'checkout', component: CheckoutComponent},
  { path: '', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [
    RouterModule.forChild(userRoutes)
  ],
  exports: [RouterModule]
})
export class UserPagesRoutingModule { }
