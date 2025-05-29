import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookSessionComponent } from './book-session.component';

describe('BookSessionComponent', () => {
  let component: BookSessionComponent;
  let fixture: ComponentFixture<BookSessionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookSessionComponent]
    });
    fixture = TestBed.createComponent(BookSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
