import {Component, OnChanges, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {User} from '../../models/user';
import {UserListService} from '../../services/user-list.service';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {

  user: User;

  constructor(
    private userListService: UserListService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.userListService.getUserByUserId(this.authService.getUserId()).subscribe(
      response => {
        this.user = response;
        console.log(this.user);
      }
    );
  }



}
