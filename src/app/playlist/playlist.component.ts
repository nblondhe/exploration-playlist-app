import { Component, OnInit, ViewChild } from '@angular/core';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
  private token;
  error;
  @ViewChild('recommended') recommended;
  spotifyUser: string;
  savedTracks = [];
  recommendations = [];
  currentTrack = {};

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit() {
    this.token = localStorage.getItem('spotifyToken');
    this.spotifyService.getUser(this.token)
      .subscribe(user => {
        this.spotifyUser = user['display_name'];
      });
    this.getSavedTracks();
  }

  getSavedTracks() {
    this.spotifyService.getSavedTracks(this.token).subscribe(data => {
      console.log(data['items']);
      this.savedTracks = data['items'].map(track => (
        {
          artists: track['track']['artists'],
          track: track['track']['name'],
          album: track['track']['album']['name'],
          coverLow: track['track']['album']['images'][2]['url'],
          coverHigh: track['track']['album']['images'][0]['url'],
          id: track['track']['id']
        }
      ));
      this.currentTrack = this.savedTracks[0];
    },
    error => {
      if (error) {
        this.error = error;
      }
    },
    () => {
      // this.savedTracks.forEach(element => {
      //   this.getRecommendations(element.id);
      // });
      this.getRecommendations(this.savedTracks[0]['id']);
    }
    );
  }
  getRecommendations(id) {
    this.spotifyService.getRecommendations(id, this.token).subscribe(data => {
      this.recommendations = data['tracks'].map(track => (
        {
          artists: track['artists'],
          track: track['name'],
          album: track['album']['name'],
          coverLow: track['album']['images'][2]['url'],
          coverHigh: track['album']['images'][0]['url'],
          seedId: id,
          id: track['id']
        }
      ));
      this.savedTracks[0]['recs'] = this.recommendations;
      console.log(this.savedTracks[0]);
    });
  }

  toggleRecommendation(event, i) {
    console.log('list index', i);
    // const element = event.target;
    // console.log(element);
    // element.classList.toggle('active');

    // if (this.savedTracks[index].isActive) {
    //   this.savedTracks[index].isActive = false;
    // } else {
    //   this.savedTracks[index].isActive = true;
    // }
    const panel = this.recommended.nativeElement;
    if (panel.style.display === 'flex') {
      panel.style.display = 'none';
    } else {
      panel.style.display = 'flex';
    }
  }

  updateCurrentTrack(i) {
    this.currentTrack = this.savedTracks[i];
    // this.currentTrack['cover'] = this.savedTracks[i].coverHigh;
  }

}
