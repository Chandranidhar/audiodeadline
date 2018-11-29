import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingmediaComponent } from './trendingmedia.component';

describe('TrendingmediaComponent', () => {
  let component: TrendingmediaComponent;
  let fixture: ComponentFixture<TrendingmediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrendingmediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrendingmediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
