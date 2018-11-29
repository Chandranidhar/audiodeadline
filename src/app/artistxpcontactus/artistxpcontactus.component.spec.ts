import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistxpcontactusComponent } from './artistxpcontactus.component';

describe('ArtistxpcontactusComponent', () => {
  let component: ArtistxpcontactusComponent;
  let fixture: ComponentFixture<ArtistxpcontactusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtistxpcontactusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistxpcontactusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
