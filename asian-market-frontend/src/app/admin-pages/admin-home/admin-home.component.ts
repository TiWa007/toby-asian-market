import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserListService} from '../../services/user-list.service';
import {User} from '../../models/user';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  user: User;

  constructor(
    private userListService: UserListService,
    private router: ActivatedRoute
  ) { }

  ngOnInit() {
  }
}
