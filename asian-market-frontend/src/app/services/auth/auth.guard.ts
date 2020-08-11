import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, NavigationExtras, Route, Router, RouterStateSnapshot} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(private authService: AuthService, private router: Router) {}

  canLoad(route: Route): boolean {
    let url = `/${route.path}`;
    if (url.startsWith('/admin')) {
      return this.checkLoginAdmin(url);
    }
    return this.checkLoginUser(url);
  }

  checkLoginUser(url: string): boolean {
    if (this.authService.isUser()) { return true; }
    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;
    // Navigate to the login page with extras
    this.router.navigate(['/login']);
    return false;
  }

  checkLoginAdmin(url: string): boolean {
    if (this.authService.isAdmin() && this.authService.isUser()) { return true; }
    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;
    // Navigate to the login page with extras
    this.router.navigate(['/login']);
    return false;
  }
}
