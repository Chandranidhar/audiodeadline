import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FanlistComponent } from './fanlist.component';

describe('FanlistComponent', () => {
  let component: FanlistComponent;
  let fixture: ComponentFixture<FanlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FanlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FanlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
