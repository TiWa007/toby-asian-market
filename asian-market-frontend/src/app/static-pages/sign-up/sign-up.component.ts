import { Component, OnInit } from '@angular/core';
import {User} from '../../models/user';
import {UserListService} from '../../services/user-list.service';
import {AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  user: User = {
    email: '',
    fullName: '',
    phone: null,
    password: '',
    isAdmin: 0,
    userId: null,
    createTime: new Date(),
    addressSet: []
  };
  // confirmpsd: string;
  // isEmailValid = true;

  constructor(
    private userListService: UserListService,
    private fb: FormBuilder,
    private  authService: AuthService
  ) {
  }

  userForm: FormGroup;


  ngOnInit() {
    this.userForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.maxLength(255), Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')],
          [UniqueEmailValidator(this.userListService)]],
        fullName: ['', [Validators.required, Validators.maxLength(255)]],
        phone: [null, [Validators.pattern('[0-9.]*'), Validators.minLength(8), Validators.maxLength(12)]],
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
        confirmPassword: ['']
      }, { validators: PasswordValidator});
  }

  get fullName() {
    return this.userForm.get('fullName');
  }

  get email() {
    return this.userForm.get('email');
  }

  get phone() {
    return this.userForm.get('phone');
  }

  get password() {
    return this.userForm.get('password');
  }

  get confirmPassword() {
    return this.userForm.get('confirmPassword');
  }

  // isEmailUnique(control: AbstractControl) {
  //   const q = new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       this.userListService.getUserByUserEmail(control.value).subscribe(resp => {
  //         if (resp) {resolve({ isEmailUnique: true }); } else { resolve(null); }
  //       });
  //     }, 1000);
  //   });
  //
  //   return q;
  // }


  submit() {
    this.user.email = this.email.value;
    this.user.fullName = this.fullName.value;
    this.user.password = this.password.value;
    if (this.phone.value) {
      this.user.phone = this.phone.value;
    }
    // console.log(this.user);
    this.userListService.registerUser(this.user).subscribe(
      resp => {
        this.authService.initUserLoggin(resp);

      }
    );
  }

}

export function PasswordValidator(control: AbstractControl): {[key: string]: boolean} | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (password.pristine || confirmPassword.pristine) {
    return null;
  }
  return password && confirmPassword && password.value !== confirmPassword.value ? { misMatch: true } : null;
}

export function UniqueEmailValidator(userListService: UserListService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return userListService.getUserByUserEmail(control.value).toPromise().then(
      user => {
        return user ? {uniqueEmail: true} : null;
      }
    );
  };
}



