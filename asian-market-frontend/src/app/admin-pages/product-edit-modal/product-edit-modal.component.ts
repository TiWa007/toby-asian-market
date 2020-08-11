import {Component, Input, OnInit} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductItem } from '../../static-pages/product-list/product-list.component';
import {ProductListService} from '../../services/product-list.service';

@Component({
  selector: 'app-product-edit-modal',
  templateUrl: './product-edit-modal.component.html',
  styleUrls: ['./product-edit-modal.component.css']
})
export class ProductEditModalComponent implements OnInit {

  @Input() public productItem: ProductItem;

  categories = ['Rice & Noodle', 'Instant Food', 'Snack', 'Sauce'];

  message: string;

  isImageChanged = false;
  isValidImage;
  isVisit = false;

  constructor(
    public activeModal: NgbActiveModal,
    private productListService: ProductListService
  ) {
  }

  ngOnInit() {
    this.isValidImage = this.productItem.imageURL ? true : false;
  }

  update() {
    if (this.productItem.product.isSale) {
      this.productItem.product.isSale = 1;
    } else {
      this.productItem.product.isSale = 0;
      this.productItem.product.salePercentage = 100;
    }
    if (this.productItem.product.productId) {
      this.productListService.updateProductDetailById(this.productItem.product.productId, this.productItem.product).subscribe();
      if (this.isImageChanged) {
        this.productListService.updateProductImage(this.productItem.imageURL, this.productItem.product.imagePath).subscribe();
      }
    } else {
      this.productListService.updateProductDetailById(-1, this.productItem.product).subscribe(
        resp => {
          this.productItem.product = resp;
          this.productListService.updateProductImage(this.productItem.imageURL, this.productItem.product.imagePath).subscribe();
        }
      );
    }

    this.activeModal.close(this.productItem);
  }

  selectedImage(event) {
    if (event.target.files && event.target.files[0]) {
      const mimeType = event.target.files[0].type;
      if (mimeType.match(/image\/*/) == null) {
        this.message = 'Only images are supported.';
        this.isValidImage = false;
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e) => {
        this.productItem.imageURL = reader.result.toString();
      };
      this.isImageChanged = true;
      this.isValidImage = true;
    }
  }

  isVisited(event) {
    this.isVisit = true;
  }


}
