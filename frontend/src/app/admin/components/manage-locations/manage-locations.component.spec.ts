import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLocationsComponent } from './manage-locations.component';

describe('ManageLocationsComponent', () => {
  let component: ManageLocationsComponent;
  let fixture: ComponentFixture<ManageLocationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageLocationsComponent]
    });
    fixture = TestBed.createComponent(ManageLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
