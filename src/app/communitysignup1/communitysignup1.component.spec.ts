import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Communitysignup1Component } from './communitysignup1.component';

describe('Communitysignup1Component', () => {
  let component: Communitysignup1Component;
  let fixture: ComponentFixture<Communitysignup1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Communitysignup1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Communitysignup1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
