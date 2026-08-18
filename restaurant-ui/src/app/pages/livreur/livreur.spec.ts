import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Livreur } from './livreur';

describe('Livreur', () => {
  let component: Livreur;
  let fixture: ComponentFixture<Livreur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Livreur],
    }).compileComponents();

    fixture = TestBed.createComponent(Livreur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
