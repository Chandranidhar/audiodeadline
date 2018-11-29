import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsorlistComponent } from './sponsorlist.component';

describe('SponsorlistComponent', () => {
  let component: SponsorlistComponent;
  let fixture: ComponentFixture<SponsorlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SponsorlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsorlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
