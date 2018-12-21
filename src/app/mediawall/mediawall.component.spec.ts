import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediawallComponent } from './mediawall.component';

describe('MediawallComponent', () => {
  let component: MediawallComponent;
  let fixture: ComponentFixture<MediawallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediawallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediawallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
