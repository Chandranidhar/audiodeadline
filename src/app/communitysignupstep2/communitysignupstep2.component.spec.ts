import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Communitysignupstep2Component } from './communitysignupstep2.component';

describe('Communitysignupstep2Component', () => {
  let component: Communitysignupstep2Component;
  let fixture: ComponentFixture<Communitysignupstep2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Communitysignupstep2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Communitysignupstep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
