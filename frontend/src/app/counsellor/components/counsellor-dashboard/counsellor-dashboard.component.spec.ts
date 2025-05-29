import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounsellorDashboardComponent } from './counsellor-dashboard.component';

describe('CounsellorDashboardComponent', () => {
  let component: CounsellorDashboardComponent;
  let fixture: ComponentFixture<CounsellorDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CounsellorDashboardComponent]
    });
    fixture = TestBed.createComponent(CounsellorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
