import { TestBed } from '@angular/core/testing';

import { ShoppingCartListService } from './shopping-cart-list.service';

describe('ShoppingCartListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShoppingCartListService = TestBed.get(ShoppingCartListService);
    expect(service).toBeTruthy();
  });
});
