/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SevynstreeterComponent } from './sevynstreeter.component';

describe('SevynstreeterComponent', () => {
  let component: SevynstreeterComponent;
  let fixture: ComponentFixture<SevynstreeterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SevynstreeterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SevynstreeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
