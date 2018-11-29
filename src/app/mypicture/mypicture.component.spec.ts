import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MypictureComponent } from './mypicture.component';

describe('MypictureComponent', () => {
  let component: MypictureComponent;
  let fixture: ComponentFixture<MypictureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MypictureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MypictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
