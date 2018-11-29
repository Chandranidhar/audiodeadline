import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistfeedComponent } from './artistfeed.component';

describe('ArtistfeedComponent', () => {
  let component: ArtistfeedComponent;
  let fixture: ComponentFixture<ArtistfeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtistfeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistfeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
