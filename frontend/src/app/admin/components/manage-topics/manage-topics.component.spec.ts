import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTopicsComponent } from './manage-topics.component';

describe('ManageTopicsComponent', () => {
  let component: ManageTopicsComponent;
  let fixture: ComponentFixture<ManageTopicsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageTopicsComponent]
    });
    fixture = TestBed.createComponent(ManageTopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
