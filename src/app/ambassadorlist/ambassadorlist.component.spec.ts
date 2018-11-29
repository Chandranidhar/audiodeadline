import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbassadorlistComponent } from './ambassadorlist.component';

describe('AmbassadorlistComponent', () => {
  let component: AmbassadorlistComponent;
  let fixture: ComponentFixture<AmbassadorlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmbassadorlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmbassadorlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
