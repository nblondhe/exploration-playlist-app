import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedTrackComponent } from './recommended-track.component';

describe('RecommendedTrackComponent', () => {
  let component: RecommendedTrackComponent;
  let fixture: ComponentFixture<RecommendedTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecommendedTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendedTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
