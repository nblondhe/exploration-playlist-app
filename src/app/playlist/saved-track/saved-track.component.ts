import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { SavedTrack } from 'src/app/savedTrack';
import { RecommendedTrack } from 'src/app/recommendedTrack';
import { dropdownAnimation } from 'src/app/animations';
import { Track } from 'src/app/track';

@Component({
  selector: 'app-saved-track',
  templateUrl: './saved-track.component.html',
  styleUrls: ['./saved-track.component.css'],
  animations: [dropdownAnimation]
})
export class SavedTrackComponent implements OnInit {

  @Input() track: Track;
  @Input() recommendedTracks;

  @Output() current = new EventEmitter<any>();
  @Output() playlistAdd = new EventEmitter<any>();
  @Output() playlistRemove = new EventEmitter<any>();

  @ViewChild('dropdown') dropdown: ElementRef;
  @ViewChild('dropdownAnchor') dropdownAnchor: ElementRef;

  dropdownState = 'out';
  recommendationsActive: boolean;


  constructor() { }

  ngOnInit() {
  }

  setCurrent(recommendedTrack?) {
    if (recommendedTrack) {
      this.current.emit(recommendedTrack);
      return;
    }
    console.log('super selected', this.track);
    this.current.emit(this.track);
    this.toggleRecommendations();
  }

  toggleRecommendations() {
    if (this.dropdownState === 'out') {
      this.dropdownState = 'in';
      this.recommendationsActive = true;
    } else {
      this.dropdownState = 'out';
    }
  }

  // toggleHighlight(element, action?) {
  //   if (action === 'deselect') {
  //     element.classList.remove('highlighted');
  //   } else {
  //     element.classList.add('highlighted');
  //   }
  // }

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

  // Inherited methods can't bubble up nested recommendation events directly
  private OnRecommendationSelected(selectedTrack: RecommendedTrack) {
    this.setCurrent(selectedTrack);
  }

  private OnRecommendationAdd(playlistTrack) {
    this.playlistAdd.emit(playlistTrack);
  }

  private OnRecommendationRemove(recommendedTrack) {
    this.playlistRemove.emit(recommendedTrack);
  }


}
