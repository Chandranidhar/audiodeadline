import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MymusicplayerComponent } from './mymusicplayer.component';

describe('MymusicplayerComponent', () => {
  let component: MymusicplayerComponent;
  let fixture: ComponentFixture<MymusicplayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MymusicplayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MymusicplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
