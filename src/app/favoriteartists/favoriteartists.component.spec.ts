import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteartistsComponent } from './favoriteartists.component';

describe('FavoriteartistsComponent', () => {
  let component: FavoriteartistsComponent;
  let fixture: ComponentFixture<FavoriteartistsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoriteartistsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteartistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
