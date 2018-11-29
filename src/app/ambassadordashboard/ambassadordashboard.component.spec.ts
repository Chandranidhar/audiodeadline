import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbassadordashboardComponent } from './ambassadordashboard.component';

describe('AmbassadordashboardComponent', () => {
  let component: AmbassadordashboardComponent;
  let fixture: ComponentFixture<AmbassadordashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmbassadordashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmbassadordashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
