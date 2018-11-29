import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicianlistComponent } from './musicianlist.component';

describe('MusicianlistComponent', () => {
  let component: MusicianlistComponent;
  let fixture: ComponentFixture<MusicianlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MusicianlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MusicianlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
