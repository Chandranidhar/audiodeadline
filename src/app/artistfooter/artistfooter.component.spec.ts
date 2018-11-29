import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistfooterComponent } from './artistfooter.component';

describe('ArtistfooterComponent', () => {
  let component: ArtistfooterComponent;
  let fixture: ComponentFixture<ArtistfooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtistfooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistfooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
