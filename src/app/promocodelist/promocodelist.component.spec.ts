import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromocodelistComponent } from './promocodelist.component';

describe('PromocodelistComponent', () => {
  let component: PromocodelistComponent;
  let fixture: ComponentFixture<PromocodelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromocodelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromocodelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
