import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingmusicsComponent } from './trendingmusics.component';

describe('TrendingmusicsComponent', () => {
  let component: TrendingmusicsComponent;
  let fixture: ComponentFixture<TrendingmusicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrendingmusicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrendingmusicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
