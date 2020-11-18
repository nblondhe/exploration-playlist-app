import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SavedTrackComponent } from './saved-track.component';

describe('SavedTrackComponent', () => {
  let component: SavedTrackComponent;
  let fixture: ComponentFixture<SavedTrackComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
