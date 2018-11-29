import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MylinkComponent } from './mylink.component';

describe('MylinkComponent', () => {
  let component: MylinkComponent;
  let fixture: ComponentFixture<MylinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MylinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MylinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
