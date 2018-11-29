import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogaddComponent } from './blogadd.component';

describe('BlogaddComponent', () => {
  let component: BlogaddComponent;
  let fixture: ComponentFixture<BlogaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlogaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
