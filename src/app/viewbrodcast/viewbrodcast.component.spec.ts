import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewbrodcastComponent } from './viewbrodcast.component';

describe('ViewbrodcastComponent', () => {
  let component: ViewbrodcastComponent;
  let fixture: ComponentFixture<ViewbrodcastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewbrodcastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewbrodcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
