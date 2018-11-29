import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingartistComponent } from './trendingartist.component';

describe('TrendingartistComponent', () => {
  let component: TrendingartistComponent;
  let fixture: ComponentFixture<TrendingartistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrendingartistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrendingartistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
