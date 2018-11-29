import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistheaderComponent } from './artistheader.component';

describe('ArtistheaderComponent', () => {
  let component: ArtistheaderComponent;
  let fixture: ComponentFixture<ArtistheaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtistheaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
