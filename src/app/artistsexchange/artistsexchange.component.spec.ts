import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistsexchangeComponent } from './artistsexchange.component';

describe('ArtistsexchangeComponent', () => {
  let component: ArtistsexchangeComponent;
  let fixture: ComponentFixture<ArtistsexchangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtistsexchangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistsexchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
