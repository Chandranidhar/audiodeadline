import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreeditComponent } from './genreedit.component';

describe('GenreeditComponent', () => {
  let component: GenreeditComponent;
  let fixture: ComponentFixture<GenreeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenreeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenreeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
