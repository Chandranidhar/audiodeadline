import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsfeedComponent } from './friendsfeed.component';

describe('FriendsfeedComponent', () => {
  let component: FriendsfeedComponent;
  let fixture: ComponentFixture<FriendsfeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendsfeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendsfeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
