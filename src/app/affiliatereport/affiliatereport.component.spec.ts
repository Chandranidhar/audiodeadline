import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliatereportComponent } from './affiliatereport.component';

describe('AffiliatereportComponent', () => {
  let component: AffiliatereportComponent;
  let fixture: ComponentFixture<AffiliatereportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffiliatereportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffiliatereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
