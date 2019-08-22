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
  trackIds = [];
  recStore = {};
  currentTrack = {};
  tab = 'savedTracks';
  playlistId;
  userId;

  constructor(private spotifyService: SpotifyService,
    private jsonService: JsonService) { }

  ngOnInit() {
    this.token = localStorage.getItem('spotifyToken');
    this.spotifyService.getUser(this.token)
      .subscribe(user => {
        this.spotifyUser = user['display_name'];
        this.userId = user['id'];
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
    // this.jsonService.getSavedTracks().subscribe(data => {
    //   this.savedTracks = data['items'].map(track => (
    //     {
    //       artists: track['track']['artists'],
    //       track: track['track']['name'],
    //       album: track['track']['album']['name'],
    //       coverLow: track['track']['album']['images'][2]['url'],
    //       coverHigh: track['track']['album']['images'][0]['url'],
    //       id: track['track']['id'],
    //       release: new Date(track['track']['album']['release_date']),
    //       addedOn: new Date(track['added_at']),
    //       album_id: track['track']['album']['id'],
    //     }
    //   ));
    //   this.currentTrack = this.savedTracks[0];
    //   this.jsonService.getRecs().subscribe(recs => {

    //     this.savedTracks.forEach(element => {
    //       this.recStore[element.id] = recs['tracks'].map(track => (
    //         {
    //           artists: track['artists'],
    //           track: track['name'],
    //           album: track['album']['name'],
    //           coverLow: track['album']['images'][2]['url'],
    //           coverHigh: track['album']['images'][0]['url'],
    //           release: new Date(track['album']['release_date']),
    //           seedId: element.id,
    //           id: track['id']
    //         }
    //       ));
    //     });
    //   });
    // });

    this.spotifyService.getSavedTracks(this.token).subscribe(data => {
      this.savedTracks = data['items'].map(track => (
        {
          artists: track['track']['artists'],
          track: track['track']['name'],
          album: track['track']['album']['name'],
          coverLow: track['track']['album']['images'][2]['url'],
          coverHigh: track['track']['album']['images'][0]['url'],
          id: track['track']['id'],
          release: new Date(track['track']['album']['release_date']),
          addedOn: new Date(track['added_at']),
          album_id: track['track']['album']['id'],
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
      this.savedTracks.forEach(element => {
        this.getRecommendations(element.id);
      });
    }
    );
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
          release: new Date(track['album']['release_date']),
          seedId: id,
          id: track['id']
        }
      ));
      this.savedTracks[0]['recs'] = this.recommendations;
    });
    // console.log(this.recStore);
  }

  // Replace with JQUERY?
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

  addTrack(track, structure, i, recTrackIndex = null) {
    if (structure === 'saved') {
      this.currentPlaylist.push(track);
      this.savedTracks[i]['added'] = true;
    } else {
      this.currentPlaylist.push(track);
      this.recStore[i][recTrackIndex]['added'] = true;
    }
  }

  removeTrack(track, index) {
    for (let i = 0; i < this.currentPlaylist.length; i++) {
      if (this.currentPlaylist[i].id === track.id) {
        this.currentPlaylist.splice(i, 1);

        if (track.seedId) {
          index = this.recStore[track.seedId].findIndex(element => element.id === track.id);
          this.recStore[track.seedId][index]['added'] = false;
        } else {
          index = this.savedTracks.findIndex(element => element.id === track.id);
          this.savedTracks[index]['added'] = false;
        }
        break;
      }
    }
  }

  createPlaylist() {
    this.spotifyService.createPlaylist(this.userId, this.token).subscribe(
          results => {
            this.playlistId = results['id'];
          },
          error => {
            if (error) {
              this.error = error;
            }
          },
          () => this.fillPlaylist()
    );
  }

  // From critics-list 0--- fillTracks
  // getTracks() {
  //   let subscribeCount = 0;
  //   const chunkSize = 99;
  //   Object.entries(this.albums).forEach(([key, value]) => {
  //     let id;
  //     if (value['id']) {
  //       id = value['id'];
  //       this._spotify
  //         .sendGet(`/albums/${id}/tracks`, this.accessToken)
  //         .subscribe(
  //           result => {
  //             subscribeCount++;
  //             result['items'].forEach(element => {
  //               const last = this.tracks[this.tracks.length - 1];
  //               if (!last || last.length === chunkSize) {
  //                 this.tracks.push(['spotify:track:' + element['id']]);
  //               } else {
  //                 last.push('spotify:track:' + element['id']);
  //               }
  //             });
  //           },
  //           error => {
  //             if (error) {
  //               this.error = error;
  //             }
  //           },
  //           () => {
  //             if (subscribeCount === this.albums.length) {
  //               this.buildList();
  //             }
  //           }
  //         );
  //     }
  //   });
  // }

  fillPlaylist() {
    const tracks = [];
    const chunkSize = 99;

    Object.entries(this.currentPlaylist).forEach(([key, value]) => {
      const last = tracks[tracks.length - 1];
      console.log(last);
      if (!last || last.length === chunkSize) {
        tracks.push(['spotify:track:' + value['id']]);
      } else {
        last.push('spotify:track:' + value['id']);
      }
    });

    console.log(tracks);
    tracks.forEach(segment => {
      this.spotifyService.buildPlaylist(this.userId, this.playlistId, this.token, segment)
        .subscribe(
          results => {
            // playlist success!
            // console.log(results);
          },
          error => {
            if (error) {
              this.error = error;
            }
          }
        );
    });
    // this.currentPlaylist.forEach(segment => {
    //   this.spotifyService.buildPlaylist(this.userId, this.playlistId, this.token, segment)
    //     .subscribe(
    //       results => {
    //         // playlist success!
    //         // console.log(results);
    //       },
    //       error => {
    //         if (error) {
    //           this.error = error;
    //         }
    //       }
    //     );
    // });
  }

  clearPlaylist() {
    this.currentPlaylist = [];

    this.savedTracks.forEach(element => {
      element.added = false;
    });
    for (const baseTrack in this.recStore) {
      if (this.recStore.hasOwnProperty(baseTrack)) {
          this.recStore[baseTrack].forEach(element => {
            element.added = false;
          });
      }
    }
  }
}
