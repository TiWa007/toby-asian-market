import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {commonURI} from '../../environments/environment';
import {User} from '../models/user';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserListService {

  constructor(
    private http: HttpClient
  ) { }

  getUserByUserId(userId: number) {
    return this.http.get<User>(`${commonURI.backendURI}/user/${userId}`);
  }

  getUserByUserEmail(email: string) {
    return this.http.get<User>(`${commonURI.backendURI}/user/email?email=${email}`);
  }

  checkUser(email: string, password: string) {
    return this.http.get<User>(`${commonURI.backendURI}/user/login?email=${email}&password=${password}`);
  }

  getUserList() {
    return this.http.get<User[]>(`${commonURI.backendURI}/user/userList`);
  }

  registerUser(user) {
    return this.http.post<User>(`${commonURI.backendURI}/user/register`, user);
  }

  updateUser(user) {
    return this.http.put(`${commonURI.backendURI}/user/update`, user, {responseType: 'text'});
  }
}
