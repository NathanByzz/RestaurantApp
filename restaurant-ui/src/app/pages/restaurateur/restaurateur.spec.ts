import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Restaurateur } from './restaurateur';

describe('Restaurateur', () => {
  let component: Restaurateur;
  let fixture: ComponentFixture<Restaurateur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Restaurateur],
    }).compileComponents();

    fixture = TestBed.createComponent(Restaurateur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
