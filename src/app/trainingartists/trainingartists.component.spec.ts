import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingartistsComponent } from './trainingartists.component';

describe('TrainingartistsComponent', () => {
  let component: TrainingartistsComponent;
  let fixture: ComponentFixture<TrainingartistsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingartistsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingartistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
