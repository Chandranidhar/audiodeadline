import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbassadoragreementComponent } from './ambassadoragreement.component';

describe('AmbassadoragreementComponent', () => {
  let component: AmbassadoragreementComponent;
  let fixture: ComponentFixture<AmbassadoragreementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmbassadoragreementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmbassadoragreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
