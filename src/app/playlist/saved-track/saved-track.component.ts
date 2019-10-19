import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { SavedTrack } from 'src/app/savedTrack';
import { Track } from 'src/app/track';

@Component({
  selector: 'app-saved-track',
  templateUrl: './saved-track.component.html',
  styleUrls: ['./saved-track.component.css']
})
export class SavedTrackComponent implements OnInit {

  @Input() savedTrack: SavedTrack;
  @Output() current = new EventEmitter<any>();
  @Output() playlistAdd = new EventEmitter<any>();
  @Output() playlistRemove = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  setCurrent() {
    this.current.emit(this.savedTrack);
  }

  setAddedToPlaylist(state: boolean) {
    this.savedTrack.addedToPlaylist = state;
  }

  addTrack(track: SavedTrack) {
    const playlistTrack = {
      track: track,
      component: this
    };
    this.playlistAdd.emit(playlistTrack);
    this.savedTrack['addedToPlaylist'] = true;
  }

  removeTrack<T extends Track>(track: T, index) {
    this.playlistRemove.emit(track);
    this.savedTrack['addedToPlaylist'] = false;
  }

  hasRecommendations(trackId: string): boolean {
    // if (this.recsFetched && this.trackRecommendationMap[trackId]) {
    //   return this.trackRecommendationMap[trackId].length > 0;
    // } else {
    //   return false;
    // }
    return false;
  }


}
