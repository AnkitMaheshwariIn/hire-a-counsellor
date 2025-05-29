import { TestBed } from '@angular/core/testing';

import { CounsellorService } from './counsellor.service';

describe('CounsellorService', () => {
  let service: CounsellorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CounsellorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
