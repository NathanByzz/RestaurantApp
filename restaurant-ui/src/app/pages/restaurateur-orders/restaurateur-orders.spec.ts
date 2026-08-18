import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurateurOrders } from './restaurateur-orders';

describe('RestaurateurOrders', () => {
  let component: RestaurateurOrders;
  let fixture: ComponentFixture<RestaurateurOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurateurOrders],
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurateurOrders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
