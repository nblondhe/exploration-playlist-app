import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { SpotifyService } from '../spotify.service';
import { JsonService } from '../json.service';
// import recData from '../../assets/recommendationResults.json';
// import savedData from './savedTracksResults.json';
// import recData from './recommendationResults.json';

// const savedTrackResults = (savedData).items;
// const recResults = (recData).tracks;

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
  private token;
  error;
  @ViewChild('collapseAnchor') collapseAnchor;
  spotifyUser: string;
  savedTracks = [];
  currentPlaylist = [];
  recommendations = [];
  recStore = {};
  currentTrack = {};
  tab = 'savedTracks';

  constructor(private spotifyService: SpotifyService,
    private jsonService: JsonService) { }

  ngOnInit() {
    this.token = localStorage.getItem('spotifyToken');
    this.spotifyService.getUser(this.token)
      .subscribe(user => {
        this.spotifyUser = user['display_name'];
      });
    this.getSavedTracks();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
     if (window.pageYOffset > 0) {
       const element = document.getElementById('tabHeader');
       element.style.background = '#454d60';
       const border = document.getElementById('border');
      border.style.boxShadow = '-13px 12px 24px -20px #000';
     } else {
      const element = document.getElementById('tabHeader');
      const border = document.getElementById('border');
      element.style.background = 'unset';
      border.style.boxShadow = 'unset';
     }
  }

  getSavedTracks() {
    // Temp JSON data
    this.jsonService.getSavedTracks().subscribe(data => {
      this.savedTracks = data['items'].map(track => (
        {
          artists: track['track']['artists'],
          track: track['track']['name'],
          album: track['track']['album']['name'],
          coverLow: track['track']['album']['images'][2]['url'],
          coverHigh: track['track']['album']['images'][0]['url'],
          id: track['track']['id'],
          release: new Date(track['track']['album']['release_date']),
          added: new Date(track['added_at']),
          album_id: track['track']['album']['id'],
        }
      ));
      this.currentTrack = this.savedTracks[0];
      this.jsonService.getRecs().subscribe(recs => {

        this.savedTracks.forEach(element => {
          this.recStore[element.id] = recs['tracks'].map(track => (
            {
              artists: track['artists'],
              track: track['name'],
              album: track['album']['name'],
              coverLow: track['album']['images'][2]['url'],
              coverHigh: track['album']['images'][0]['url'],
              release: new Date(track['album']['release_date']),
              seedId: element.id,
              // id: track['id']
            }
          ));
        });
        console.log(this.recStore);
      });
    });
    // this.spotifyService.getSavedTracks(this.token).subscribe(data => {
    //   // console.log(data['items']);
    //   this.savedTracks = data['items'].map(track => (
    //     {
    //       artists: track['track']['artists'],
    //       track: track['track']['name'],
    //       album: track['track']['album']['name'],
    //       coverLow: track['track']['album']['images'][2]['url'],
    //       coverHigh: track['track']['album']['images'][0]['url'],
    //       id: track['track']['id']
    //     }
    //   ));
    //   this.currentTrack = this.savedTracks[0];
    // },
    // error => {
    //   if (error) {
    //     this.error = error;
    //   }
    // },
    // () => {
    //   this.savedTracks.forEach(element => {
    //     this.getRecommendations(element.id);
    //   });
    //   // console.log(this.recStore);
    // }
    // );
  }
  getRecommendations(id) {
    this.spotifyService.getRecommendations(id, this.token).subscribe(data => {
      this.recStore[id] = data['tracks'].map(track => (
        {
          artists: track['artists'],
          track: track['name'],
          album: track['album']['name'],
          coverLow: track['album']['images'][2]['url'],
          coverHigh: track['album']['images'][0]['url'],
          seedId: id,
          // id: track['id']
        }
      ));
      // this.savedTracks[0]['recs'] = this.recommendations;
      // console.log(this.savedTracks[0]);
    });
  }

  toggleRecommendation(event) {
    const anchor = event.target.parentNode.parentNode;
    const tracksList = anchor.parentNode;
    const allSavedChildren = anchor.parentNode.parentNode.children;

    if (anchor.classList.contains('highlighted')) {
      anchor.classList.remove('highlighted');
    } else {
      anchor.classList.add('highlighted');
    }

    const panel = anchor.nextElementSibling;
    // Display
    if (panel.style.display === 'flex') {
      panel.style.display = 'none';
    } else {
      panel.style.display = 'flex';
    }
    // Ease drop down
    if (panel.style.maxHeight){
      panel.style.maxHeight = null;
      panel.style.webkitTransition = 'max-height 1s ease-in-out';
    } else {
      panel.style.maxHeight = panel.scrollHeight + '8' + 'px';
      panel.style.webkitTransition = 'max-height 1s ease-in-out';
    }

    for (let i = 0; i < allSavedChildren.length; i++) {
      const current = allSavedChildren[i];
      // Mute not selected
      if (current !== tracksList) {
        if (current.classList.contains('mute')) {
           current.classList.remove('mute');
        } else {
           current.classList.add('mute');
        }
      }
    }
  }

  addAllRecommendations(trackId) {
    this.recStore[trackId].forEach(element => {
      this.currentPlaylist.push(element);
    });
  }
}
