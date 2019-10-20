import { Component, OnInit, ViewChild, HostListener, Directive, Input, ElementRef } from '@angular/core';
import { SpotifyService } from '../spotify.service';
import { JsonService } from '../json.service';
import { notificationAnimations, NotifAnimationState } from '../animations';
import { SavedTrack } from '../savedTrack';
import { SpotifyUser } from '../spotifyUser';
import { Track } from '../track';
import { RecommendedTrack } from '../recommendedTrack';
import { SavedTrackComponent } from './saved-track/saved-track.component';

export class Notification {
  content: string;
  style: string;
  dismissed = false;

  constructor(content, style?) {
    this.content = content;
    this.style = style || 'info';
  }
}

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css'],
  animations: [notificationAnimations.fadeNotif]
})
export class PlaylistComponent implements OnInit {
  private token: string;
  error: string;
  spotifyUser: SpotifyUser;
  playlistId: string;
  activePanelId: string;
  trackIds = [];
  currentTrack = {};
  activePanel = {};
  animationState: NotifAnimationState = 'default';
  @ViewChild('collapseAnchor') collapseAnchor: ElementRef;
  @ViewChild('trackRow') trackRowRef: ElementRef;
  recsFetched: boolean;

  notifications = [];
  currentPlaylist = [];
  savedTracks: SavedTrack[];
  trackRecommendationMap: {[id: string]: Array<RecommendedTrack>; } = {};

  constructor(private spotifyService: SpotifyService,
    private jsonService: JsonService) { }

    // When making changes to ngFor collection,
    // DOM should only re-render the returned id - not all of collection
    trackById(i, id) {
      return id;
    }

  // TODO Subscribe chain could be refactored to mergemap/switchmap or other RXJS operator
  ngOnInit() {
    this.token = localStorage.getItem('spotifyToken');
    this.spotifyService.getUser(this.token)
      .subscribe(user => {
        this.spotifyUser = user;
      });
    this.getSavedTracks();
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
    //       albumId: track['track']['album']['id'],
    //     }
    //     ));
    //   this.currentTrack = this.savedTracks[0];
    //   this.jsonService.getRecs().subscribe(recs => {

    //     this.savedTracks.forEach(element => {
    //       this.trackRecommendationMap[element.id] = recs['tracks'].map(track => (
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
    //         ));
    //       });
    //     });

    // });

      this.spotifyService.getSavedTracks(this.token).subscribe(savedTracks => {
          this.savedTracks = savedTracks;
        this.currentTrack = this.savedTracks[0];
      },
        error => {
            if (error) {
                this.error = error;
              }
            },
            () => {
                this.savedTracks.forEach(element => {
                    this.getRecommendations(element.id, [element.artists, element.track]);
                  });
                }
              );
            }

            getRecommendations(id: string, attributes: any[]) {
                this.spotifyService.getRecommendations(id, attributes, this.token).subscribe(recommendedTracks => {
                    this.trackRecommendationMap[id] = recommendedTracks;
                  }, error => {
                      if (error) {
                          this.error = error;
                        }
      },
      () => this.recsFetched = true
    );
  }

  OnSelected<T extends Track>(selectedTrack: T) {
    this.currentTrack = selectedTrack;
  }

  OnAdd(playlistTrack) {
    this.currentPlaylist.push(playlistTrack);
  }

  OnRemove<T extends Track>(track: T, component?: SavedTrackComponent) {
    for (let i = 0; i < this.currentPlaylist.length; i++) {
      if (this.currentPlaylist[i].track.id === track.id) {
        this.currentPlaylist.splice(i, 1);

        if (component) {
          component.setAddedToPlaylist(false);
        }
        break;
      }
    }
  }

  createPlaylist() {
    if (this.currentPlaylist.length > 0) {
      this.spotifyService.createPlaylist(this.spotifyUser.id, this.token).subscribe(
        id => {
          this.playlistId = id;
        },
        error => {
          if (error) {
            this.error = error;
          }
        },
        () => this.fillPlaylist()
      );
    } else {
      this.sendNotification('Add saved or recommended tracks to create a playlist.', 'error');
    }
  }

  fillPlaylist() {
    const tracks = [];
    const chunkSize = 99;

    Object.entries(this.currentPlaylist).forEach(([key, value]) => {
      const last = tracks[tracks.length - 1];
      if (!last || last.length === chunkSize) {
        tracks.push(['spotify:track:' + value['id']]);
      } else {
        last.push('spotify:track:' + value['id']);
      }
    });

      tracks.forEach(segment => {
        this.spotifyService.buildPlaylist(this.spotifyUser.id, this.playlistId, this.token, segment)
          .subscribe(
            results => {
              if (results) {
                this.sendNotification('Playlist added!', 'success');
              }
            },
            error => {
              if (error) {
                this.sendNotification('Error creating playlist.', 'error');
                this.error = error;
              }
            }
          );
      });
  }

  clearPlaylist() {
    this.currentPlaylist = [];
    for (let i = 0; i < this.savedTracks.length; i++) {
      this.savedTracks[i].addedToPlaylist = false;
    }

    for (const baseTrackKey in this.trackRecommendationMap) {
      if (this.trackRecommendationMap.hasOwnProperty(baseTrackKey)) {
        for (let i = 0; i < this.trackRecommendationMap[baseTrackKey].length; i++) {
          this.trackRecommendationMap[baseTrackKey][i].addedToPlaylist = false;
        }
      }
    }
  }

  sendNotification(content, style) {
    const notification = new Notification(content, style);
    this.notifications.push(notification);
  }
  closeNotification(notif: Notification) {
    const noteToDismiss = this.notifications.indexOf(notif);
    this.notifications[noteToDismiss].dismissed = true;
  }

  onFadeFinished(event) {
    const { toState } = event;
    const isFadeOut = (toState as NotifAnimationState) === 'closing';
    const itFinished = this.animationState === 'closing';

    if (isFadeOut && itFinished) {
      this.notifications = [];
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
    const element = document.getElementById('appHeader');
    if (element) {
      if (window.pageYOffset > 0 && element) {
        element.style.background = '#63adf2';
        element.style.boxShadow = '-13px 12px 24px -20px #000';
      } else {
        element.style.background = 'unset';
        element.style.boxShadow = 'unset';
      }
    }
  }


}
