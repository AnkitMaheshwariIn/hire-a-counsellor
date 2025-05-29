import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCounsellorsComponent } from './manage-counsellors.component';

describe('ManageCounsellorsComponent', () => {
  let component: ManageCounsellorsComponent;
  let fixture: ComponentFixture<ManageCounsellorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageCounsellorsComponent]
    });
    fixture = TestBed.createComponent(ManageCounsellorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
