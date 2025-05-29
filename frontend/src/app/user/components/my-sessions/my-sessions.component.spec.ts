import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySessionsComponent } from './my-sessions.component';

describe('MySessionsComponent', () => {
  let component: MySessionsComponent;
  let fixture: ComponentFixture<MySessionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MySessionsComponent]
    });
    fixture = TestBed.createComponent(MySessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
