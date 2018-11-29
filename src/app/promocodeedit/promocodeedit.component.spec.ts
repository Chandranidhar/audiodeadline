import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromocodeeditComponent } from './promocodeedit.component';

describe('PromocodeeditComponent', () => {
  let component: PromocodeeditComponent;
  let fixture: ComponentFixture<PromocodeeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromocodeeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromocodeeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
