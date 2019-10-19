import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedTrackComponent } from './saved-track.component';

describe('SavedTrackComponent', () => {
  let component: SavedTrackComponent;
  let fixture: ComponentFixture<SavedTrackComponent>;

  beforeEach(async(() => {
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
