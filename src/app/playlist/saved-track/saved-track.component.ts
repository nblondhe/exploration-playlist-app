import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { dropdownAnimation, expansionArrow } from 'src/app/animations';
import { RecommendedTrack } from '../../models/recommendedTrack';
import { Track } from '../../models/track';

@Component({
  selector: 'app-saved-track',
  templateUrl: './saved-track.component.html',
  styleUrls: ['./saved-track.component.css'],
  animations: [dropdownAnimation, expansionArrow]
})
export class SavedTrackComponent implements OnInit {

  @Input() track: Track;
  @Input() recommendedTracks: Track[];

  @Output() current = new EventEmitter();
  @Output() playlistAdd = new EventEmitter();
  @Output() playlistRemove = new EventEmitter();

  @ViewChild('dropdownAnchor', { static: false }) dropdownAnchor: ElementRef;
  @ViewChild('dropdown', { static: false }) dropdown: ElementRef;

  dropdownState = 'out';
  expansionArrowState = 'default';
  recommendationsActive = false;

  constructor() { }

  ngOnInit() {
  }

  setCurrent(recommendedTrack?) {
    if (recommendedTrack) {
      this.current.emit(recommendedTrack);
      return;
    }
    this.current.emit(this.track);
  }

  toggleRecommendations() {
    if (this.dropdownState === 'out') {
      this.dropdownState = 'in';
      this.expansionArrowState = 'rotated';
      this.recommendationsActive = true;
    } else {
      this.dropdownState = 'out';
      this.expansionArrowState = 'default';
    }
  }

  setAddedToPlaylist(state: boolean) {
    this.track.addedToPlaylist = state;
  }

  addTrack() {
    const playlistTrack = {
      track: this.track,
      component: this
    };
    this.playlistAdd.emit(playlistTrack);
    this.track['addedToPlaylist'] = true;
  }

  removeTrack() {
    this.playlistRemove.emit(this.track);
    this.track['addedToPlaylist'] = false;
  }

  // Can't bubble up nested recommendation events directly through SavedTrackComponent to playlist
  private OnRecommendationSelected(selectedTrack: RecommendedTrack) {
    this.setCurrent(selectedTrack);
  }

  private OnRecommendationAdd(playlistTrack) {
    this.playlistAdd.emit(playlistTrack);
  }

  private OnRecommendationRemove(recommendedTrack: RecommendedTrack) {
    this.playlistRemove.emit(recommendedTrack);
  }


}
