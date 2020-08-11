import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {UserListService} from '../../services/user-list.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;
  isInvalid = false;
  loading = false;

  constructor(
    private authService: AuthService,
    private userListService: UserListService
  ) { }

  ngOnInit() {
    this.authService.checkUserLogin();
    this.email = '';
    this.password = '';
  }

  login() {
    this.loading = true;
    this.userListService.checkUser(this.email, this.password).subscribe(
      resp => {
        if (resp) {
          this.authService.initUserLoggin(resp);
        } else {
          this.isInvalid = true;
          this.loading = false;
        }
      }
    );
  }
}
