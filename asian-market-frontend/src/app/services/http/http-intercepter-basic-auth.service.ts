import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpIntercepterBasicAuthService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let username = 'User';
    let password = '6f68392a-e268-4e58-bd09-27f4086e787a';
    let basicAuthHeaderStirng = 'Basic ' + window.btoa(username + ':' + password);

    req = req.clone({
      setHeaders: {
        Authorization: basicAuthHeaderStirng
      }
    });

    return next.handle(req);
  }

}
