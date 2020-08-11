import { TestBed } from '@angular/core/testing';

import { OrderListService } from './order-list.service';

describe('OrderListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrderListService = TestBed.get(OrderListService);
    expect(service).toBeTruthy();
  });
});
