import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DancerlistComponent } from './dancerlist.component';

describe('DancerlistComponent', () => {
  let component: DancerlistComponent;
  let fixture: ComponentFixture<DancerlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DancerlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DancerlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
