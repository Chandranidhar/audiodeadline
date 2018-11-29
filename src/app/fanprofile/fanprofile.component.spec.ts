import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FanprofileComponent } from './fanprofile.component';

describe('FanprofileComponent', () => {
  let component: FanprofileComponent;
  let fixture: ComponentFixture<FanprofileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FanprofileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FanprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
