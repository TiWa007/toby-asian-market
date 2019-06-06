import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './pages-static/navbar/navbar.component';
import { FooterComponent } from './pages-static/footer/footer.component';
import {FormsModule} from '@angular/forms';
import { ProductListComponent } from './pages-static/product-list/product-list.component';
import {HttpClientModule} from '@angular/common/http';
import { ErrorComponent } from './error/error.component';
import { ContactComponent } from './pages-static/contact/contact.component';
import { ShoppingCartComponent } from './transaction-page/shopping-cart/shopping-cart.component';
import { LoginComponent } from './user-pages/login/login.component';
import { SignUpComponent } from './user-pages/sign-up/sign-up.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    ProductListComponent,
    ErrorComponent,
    ContactComponent,
    ShoppingCartComponent,
    LoginComponent,
    SignUpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
