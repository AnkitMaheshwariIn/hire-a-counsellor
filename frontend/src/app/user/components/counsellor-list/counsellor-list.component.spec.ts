import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounsellorListComponent } from './counsellor-list.component';

describe('CounsellorListComponent', () => {
  let component: CounsellorListComponent;
  let fixture: ComponentFixture<CounsellorListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CounsellorListComponent]
    });
    fixture = TestBed.createComponent(CounsellorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
