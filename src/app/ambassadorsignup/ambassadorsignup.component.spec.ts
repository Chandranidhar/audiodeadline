import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbassadorsignupComponent } from './ambassadorsignup.component';

describe('AmbassadorsignupComponent', () => {
  let component: AmbassadorsignupComponent;
  let fixture: ComponentFixture<AmbassadorsignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmbassadorsignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmbassadorsignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
