import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreaddComponent } from './genreadd.component';

describe('GenreaddComponent', () => {
  let component: GenreaddComponent;
  let fixture: ComponentFixture<GenreaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenreaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenreaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
