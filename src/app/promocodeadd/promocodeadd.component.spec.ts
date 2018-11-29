import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromocodeaddComponent } from './promocodeadd.component';

describe('PromocodeaddComponent', () => {
  let component: PromocodeaddComponent;
  let fixture: ComponentFixture<PromocodeaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromocodeaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromocodeaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
