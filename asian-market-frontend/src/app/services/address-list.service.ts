import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/user';
import {commonURI} from '../../environments/environment';
import {Address} from '../models/address';

@Injectable({
  providedIn: 'root'
})
export class AddressListService {

  constructor(
    private http: HttpClient
  ) { }

  getAddressByUserId(userId: number) {
    return this.http.get<Address[]>(`${commonURI.backendURI}/user/address/userId/${userId}`);
  }

  addAddress(address: Address) {
    return this.http.post<Address>(`${commonURI.backendURI}/user/address/add`, address);
  }

  updateAddress(address: Address) {
    return this.http.put(`${commonURI.backendURI}/user/address/update`, address);
  }
}
