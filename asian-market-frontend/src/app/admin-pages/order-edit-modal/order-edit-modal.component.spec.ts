import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderEditModalComponent } from './order-edit-modal.component';

describe('OrderEditModalComponent', () => {
  let component: OrderEditModalComponent;
  let fixture: ComponentFixture<OrderEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
