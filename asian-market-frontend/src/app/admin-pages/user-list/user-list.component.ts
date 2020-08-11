import { Component, OnInit } from '@angular/core';
import {UserListService} from '../../services/user-list.service';
import {User} from '../../models/user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  userList: User[];

  constructor(
    private userListService: UserListService
  ) { }

  ngOnInit() {
    this.userListService.getUserList().subscribe(
      response => {
        this.userList = response;
      }
    );
  }



}
