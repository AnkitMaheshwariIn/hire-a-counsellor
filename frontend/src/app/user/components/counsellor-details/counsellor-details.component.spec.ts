import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounsellorDetailsComponent } from './counsellor-details.component';

describe('CounsellorDetailsComponent', () => {
  let component: CounsellorDetailsComponent;
  let fixture: ComponentFixture<CounsellorDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CounsellorDetailsComponent]
    });
    fixture = TestBed.createComponent(CounsellorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
