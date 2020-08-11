import { Injectable } from '@angular/core';
import {User} from '../../models/user';
import {UserListService} from '../user-list.service';
import {Router} from '@angular/router';
import {CART_PRODUCT_ID, ShoppingCartListService} from '../shopping-cart-list.service';
import {CartProduct} from '../../models/cart-product';

export const USER_TYPE = 'userType';
export const USER_ID = 'userId';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(
    private userListService: UserListService,
    private router: Router,
    private shoppingCartListService: ShoppingCartListService
  ) { }

  redirectUrl: string;

  initUserLoggin(user: User) {
    sessionStorage.setItem(USER_ID, user.userId.toString());

    // Merge shopping cart
    const cartProductIdList = this.shoppingCartListService.getCartProductIdFromSessionStorage();
    if (cartProductIdList.length !== 0) {
      let cartProductList: CartProduct[] = [];
      this.shoppingCartListService.getCartProductByIdList(cartProductIdList.toString()).subscribe(
        res => {
          cartProductList = res;
          for (const p of cartProductList) {
            p.user = user;
            this.shoppingCartListService.updateCartProduct(p).subscribe();
          }
        }
      );
    }

    if (user.isAdmin === 1) {
      sessionStorage.setItem(USER_TYPE, 'Admin');
      // If no redirect has been set, use the default
      const redirect = this.redirectUrl ? this.router.parseUrl(this.redirectUrl) : '/admin';
      // Redirect the user
      this.router.navigateByUrl(redirect);
      // this.router.navigate([redirect], { queryParams: { userId: this.user.userId } });
    } else {
      sessionStorage.setItem(USER_TYPE, 'User');
      // If no redirect has been set, use the default
      const redirect = this.redirectUrl ? this.router.parseUrl(this.redirectUrl) : '/user';
      // Redirect the user
      this.router.navigateByUrl(redirect);
      // this.router.navigate([redirect], { queryParams: { userId: this.user.userId } });
    }
  }

  checkUserLogin() {
    const userType = sessionStorage.getItem(USER_TYPE);
    if (userType === 'Admin') {
      this.router.navigateByUrl('/admin');
    }
    if (userType === 'User') {
      this.router.navigateByUrl('/user');
    }
  }

  isUser() {
    const userType = sessionStorage.getItem(USER_TYPE);
    return (userType === 'User' || userType === 'Admin');
  }

  isAdmin() {
    const userType = sessionStorage.getItem(USER_TYPE);
    return userType === 'Admin';
  }

  getUserId() {
    const userId = sessionStorage.getItem(USER_ID);
    if (userId != null) { return +userId; }
    return null;
  }

  logout(): void {
    sessionStorage.removeItem(USER_ID);
    sessionStorage.removeItem(USER_TYPE);
    sessionStorage.removeItem(CART_PRODUCT_ID);
    this.router.navigateByUrl('/home');
  }


}

// _authenticateUser(email: string, password: string) {
//   return this.userListService.checkUser(email, password).subscribe(
//     response => {
//       this.user = response;
//       if (this.user) {
//         sessionStorage.setItem(USER_ID, this.user.userId.toString());
//
//         // Merge shopping cart
//         const cartProductIdList = this.shoppingCartListService.getCartProductIdFromSessionStorage();
//         if (cartProductIdList.length !== 0) {
//           let cartProductList: CartProduct[] = [];
//           this.shoppingCartListService.getCartProductByIdList(cartProductIdList.toString()).subscribe(
//             res => {
//               cartProductList = res;
//               for (const p of cartProductList) {
//                 p.user = this.user;
//                 this.shoppingCartListService.updateCartProduct(p).subscribe();
//               }
//             }
//           );
//         }
//
//         if (this.user.isAdmin === 1) {
//           sessionStorage.setItem(USER_TYPE, 'Admin');
//           // If no redirect has been set, use the default
//           const redirect = this.redirectUrl ? this.router.parseUrl(this.redirectUrl) : '/admin';
//           // Redirect the user
//           this.router.navigateByUrl(redirect);
//           // this.router.navigate([redirect], { queryParams: { userId: this.user.userId } });
//         } else {
//           sessionStorage.setItem(USER_TYPE, 'User');
//           // If no redirect has been set, use the default
//           const redirect = this.redirectUrl ? this.router.parseUrl(this.redirectUrl) : '/user';
//           // Redirect the user
//           this.router.navigateByUrl(redirect);
//           // this.router.navigate([redirect], { queryParams: { userId: this.user.userId } });
//         }
//       }
//     }
//   );
// }
