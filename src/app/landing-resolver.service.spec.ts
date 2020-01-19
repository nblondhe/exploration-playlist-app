import { TestBed } from '@angular/core/testing';

import { LandingResolverService } from './landing-resolver.service';

describe('LandingResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LandingResolverService = TestBed.get(LandingResolverService);
    expect(service).toBeTruthy();
  });
});
