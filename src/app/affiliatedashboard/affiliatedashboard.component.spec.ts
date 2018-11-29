import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliatedashboardComponent } from './affiliatedashboard.component';

describe('AffiliatedashboardComponent', () => {
  let component: AffiliatedashboardComponent;
  let fixture: ComponentFixture<AffiliatedashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffiliatedashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffiliatedashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
