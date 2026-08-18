import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurateurMenu } from './restaurateur-menu';

describe('RestaurateurMenu', () => {
  let component: RestaurateurMenu;
  let fixture: ComponentFixture<RestaurateurMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurateurMenu],
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurateurMenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
