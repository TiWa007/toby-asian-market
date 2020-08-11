import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {User} from '../../models/user';
import {AddressListService} from '../../services/address-list.service';
import {Address} from '../../models/address';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit, OnChanges {

  @Input() user: User;
  addressList: Address[];
  isEdit = false;
  isAdd = false;
  address: Address;
  addressForm: FormGroup;

  constructor(
    private addressListService: AddressListService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.user ) {
      this.upgradeAddressList();
    }
  }

  upgradeAddressList() {
    this.addressListService.getAddressByUserId(this.user.userId).subscribe(
      response => {
        this.addressList = response;
      }
    );
  }

  editAddress(index: number) {
    this.isEdit = true;
    this.address = this.addressList[index];
    this.addressForm = this.fb.group(
      {
        fullName: [this.address.fullName, [Validators.required, Validators.maxLength(255)]],
        country: [this.address.country, [Validators.required, Validators.maxLength(255)]],
        postcode: [this.address.postcode, [Validators.required, Validators.pattern('[0-9.]*'),
          Validators.minLength(4), Validators.maxLength(8)]],
        addressLine1: [this.address.addressLine1, [Validators.required, Validators.maxLength(255)]],
        addressLine2: [this.address.addressLine2, [Validators.maxLength(255)]],
        city: [this.address.city, [Validators.required, Validators.maxLength(255)]],
        phoneNumber: [this.address.phoneNumber, [Validators.required, Validators.pattern('[0-9.]*'), Validators.minLength(8), Validators.maxLength(12)]],
      });
  }

  addAddress() {
    this.isEdit = true;
    this.isAdd = true;
    this.address = new Address();
    this.addressForm = this.fb.group(
      {
        fullName: ['', [Validators.required, Validators.maxLength(255)]],
        country: ['', [Validators.required, Validators.maxLength(255)]],
        postcode: ['', [Validators.required, Validators.pattern('[0-9.]*'),
          Validators.minLength(4), Validators.maxLength(8)]],
        addressLine1: ['', [Validators.required, Validators.maxLength(255)]],
        addressLine2: [null, [Validators.maxLength(255)]],
        city: ['', [Validators.required, Validators.maxLength(255)]],
        phoneNumber: ['', [Validators.required, Validators.pattern('[0-9.]*'), Validators.minLength(8), Validators.maxLength(12)]],
      });
  }

  get fullName() {
    return this.addressForm.get('fullName');
  }

  get country() {
    return this.addressForm.get('country');
  }

  get postcode() {
    return this.addressForm.get('postcode');
  }

  get addressLine1() {
    return this.addressForm.get('addressLine1');
  }

  get addressLine2() {
    return this.addressForm.get('addressLine2');
  }

  get city() {
    return this.addressForm.get('city');
  }

  get phoneNumber() {
    return this.addressForm.get('phoneNumber');
  }

  submit() {
    this.address.phoneNumber = this.phoneNumber.value;
    this.address.city = this.city.value;
    if (this.addressLine2.value) this.address.addressLine2 = this.addressLine2.value;
    this.address.addressLine1 = this.addressLine1.value;
    this.address.postcode = this.postcode.value;
    this.address.country = this.country.value;
    this.address.fullName = this.fullName.value;
    this.address.user = this.user;
    console.log(this.address);
    if (this.isAdd) {
      this.addressListService.addAddress(this.address).subscribe(
        response => {
          this.address = response;
          this.upgradeAddressList();
        }
      );
    } else {
      this.addressListService.updateAddress(this.address).subscribe();
    }
    this.isAdd = false;
    this.isEdit = false;
  }

  delete(index: number) {
    this.address = this.addressList[index];
    // this.address.user = null;
    // console.log(this.address.user);
    this.addressListService.updateAddress(this.address).subscribe();
    this.addressList.splice(index, 1);
  }

  cancel() {
    this.isAdd = false;
    this.isEdit = false;
  }
}
