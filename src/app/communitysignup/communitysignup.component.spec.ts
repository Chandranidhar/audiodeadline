import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunitysignupComponent } from './communitysignup.component';

describe('CommunitysignupComponent', () => {
  let component: CommunitysignupComponent;
  let fixture: ComponentFixture<CommunitysignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunitysignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunitysignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
