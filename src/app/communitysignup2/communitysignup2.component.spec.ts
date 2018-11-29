import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Communitysignup2Component } from './communitysignup2.component';

describe('Communitysignup2Component', () => {
  let component: Communitysignup2Component;
  let fixture: ComponentFixture<Communitysignup2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Communitysignup2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Communitysignup2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
