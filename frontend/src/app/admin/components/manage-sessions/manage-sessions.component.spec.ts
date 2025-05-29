import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSessionsComponent } from './manage-sessions.component';

describe('ManageSessionsComponent', () => {
  let component: ManageSessionsComponent;
  let fixture: ComponentFixture<ManageSessionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageSessionsComponent]
    });
    fixture = TestBed.createComponent(ManageSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
