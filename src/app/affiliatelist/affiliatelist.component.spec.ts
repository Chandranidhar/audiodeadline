import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliatelistComponent } from './affiliatelist.component';

describe('AffiliatelistComponent', () => {
  let component: AffiliatelistComponent;
  let fixture: ComponentFixture<AffiliatelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffiliatelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffiliatelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
