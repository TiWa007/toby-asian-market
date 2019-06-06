import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input() isUser: boolean;
  @Input() isAdmin: boolean;

  logout() {
    this.isUser = false;
    this.isAdmin = false;
  }

}
