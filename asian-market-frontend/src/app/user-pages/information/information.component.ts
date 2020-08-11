import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../models/user';
import {UserListService} from '../../services/user-list.service';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {

  constructor(
    private userListService: UserListService
  ) { }

  @Input() user: User;
  isEditable = false;
  isChangingPassword = false;
  newPsd = '';

  ngOnInit() {
  }

  edit() {
    this.isEditable = true;
  }

  changePassword() {
    this.isChangingPassword = true;
    this.isEditable = true;
  }

  onSubmit(form) {

    if (this.isEditable && !this.isChangingPassword) {
      this.user.fullName = form.value.fullname;
      this.user.phone = form.value.phone;
    }

    if (this.isChangingPassword) {
      this.user.password = this.newPsd;
    }

    this.userListService.updateUser(this.user).subscribe();

    this.cancel();
  }

  cancel() {
    this.isEditable = false;
    this.isChangingPassword = false;
  }

}
