import {Component, Input, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {User} from '../../models/user';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  // @Input() user: User;
  // @Input() isUser: boolean;
  // @Input() isAdmin: boolean;

  logout() {
    this.authService.logout();
  }

}
