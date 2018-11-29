import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsaleComponent } from './ticketsale.component';

describe('TicketsaleComponent', () => {
  let component: TicketsaleComponent;
  let fixture: ComponentFixture<TicketsaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketsaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
