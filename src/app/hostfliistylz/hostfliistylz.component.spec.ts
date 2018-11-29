import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostfliistylzComponent } from './hostfliistylz.component';

describe('HostfliistylzComponent', () => {
  let component: HostfliistylzComponent;
  let fixture: ComponentFixture<HostfliistylzComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostfliistylzComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostfliistylzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
