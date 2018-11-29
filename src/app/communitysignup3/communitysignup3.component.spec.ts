import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Communitysignup3Component } from './communitysignup3.component';

describe('Communitysignup3Component', () => {
  let component: Communitysignup3Component;
  let fixture: ComponentFixture<Communitysignup3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Communitysignup3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Communitysignup3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
