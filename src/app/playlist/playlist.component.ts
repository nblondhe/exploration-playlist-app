import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { SpotifyService } from '../spotify.service';
import { JsonService } from '../json.service';
import { notificationAnimations, NotifAnimationState } from './notification-animations';

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
  @ViewChild('collapseAnchor') collapseAnchor;
  spotifyUser: string;
  savedTracks = [];
  currentPlaylist = [];
  // recommendations = [];
  trackIds = [];
  recommendations = {};
  currentTrack = {};
  tab = 'savedTracks';
  playlistId: string;
  userId: string;
  notifications = [];
  activePanelId: string;
  activePanel = {};
  animationState: NotifAnimationState = 'default';

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

  trackById(i, id) {
    return id;
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
    if (window.pageYOffset > 0) {
      const element = document.getElementById('tabHeader');
      element.style.background = '#63adf2';
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
          addedOn: new Date(track['added_at']),
          album_id: track['track']['album']['id'],
        }
      ));
      this.currentTrack = this.savedTracks[0];
      this.jsonService.getRecs().subscribe(recs => {

        this.savedTracks.forEach(element => {
          this.recommendations[element.id] = recs['tracks'].map(track => (
            {
              artists: track['artists'],
              track: track['name'],
              album: track['album']['name'],
              coverLow: track['album']['images'][2]['url'],
              coverHigh: track['album']['images'][0]['url'],
              release: new Date(track['album']['release_date']),
              seedId: element.id,
              id: track['id']
            }
          ));
        });
      });
    });

    // this.spotifyService.getSavedTracks(this.token).subscribe(data => {
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
    // },
    //   error => {
    //     if (error) {
    //       this.error = error;
    //     }
    //   },
    //   () => {
    //     this.savedTracks.forEach(element => {
    //       this.getRecommendations(element.id, [element.artists, element.track]);
    //     });
    //   }
    // );
  }

  getRecommendations(id, attributes) {
    const basedOn = attributes[1] + ' - ' + attributes[0][0]['name'];
    this.spotifyService.getRecommendations(id, this.token).subscribe(data => {
      this.recommendations[id] = data['tracks'].map(track => (
        {
          artists: track['artists'],
          track: track['name'],
          album: track['album']['name'],
          coverLow: track['album']['images'][2]['url'],
          coverHigh: track['album']['images'][0]['url'],
          release: new Date(track['album']['release_date']),
          seedId: id,
          basedOn: basedOn,
          id: track['id']
        }
      ));
      this.savedTracks[0]['recs'] = [];
    });
  }


  addTrack(track, structure, i, recTrackIndex = null) {
    if (structure === 'saved') {
      this.currentPlaylist.push(track);
      this.savedTracks[i]['added'] = true;
    } else {
      this.currentPlaylist.push(track);
      this.recommendations[i][recTrackIndex]['added'] = true;
    }
  }

  removeTrack(track, index) {
    for (let i = 0; i < this.currentPlaylist.length; i++) {
      if (this.currentPlaylist[i].id === track.id) {
        this.currentPlaylist.splice(i, 1);

        if (track.seedId) {
          index = this.recommendations[track.seedId].findIndex(element => element.id === track.id);
          this.recommendations[track.seedId][index]['added'] = false;
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

    if (tracks.length > 0) {
      tracks.forEach(segment => {
        this.spotifyService.buildPlaylist(this.userId, this.playlistId, this.token, segment)
          .subscribe(
            results => {
              this.sendNotification('Playlist added!', 'success');
            },
            error => {
              if (error) {
                this.sendNotification('Error creating playlist.', 'error');
                this.error = error;
              }
            }
          );
      });
    } else {
      this.sendNotification('Add saved or recommended tracks to create a playlist.', 'error');
    }
  }

  clearPlaylist() {
    this.currentPlaylist = [];

    this.savedTracks.forEach(element => {
      element.added = false;
    });
    for (const baseTrack in this.recommendations) {
      if (this.recommendations.hasOwnProperty(baseTrack)) {
        this.recommendations[baseTrack].forEach(element => {
          element.added = false;
        });
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

  toggleRecommendation(event) {
    const anchor = event.target.parentNode.parentNode;
    const clickedPanel = anchor.nextElementSibling;

    if (this.activePanel['element'] &&
    this.activePanel['element'] === clickedPanel) {
      if (this.activePanel['opened'] === true) {
        this.togglePanel(anchor, clickedPanel, 'close');
      } else {
        this.togglePanel(anchor, clickedPanel);
      }
    } else if (this.activePanel['element']) {
      this.togglePanel(anchor, this.activePanel['element'], 'close');
      this.toggleHighlight(this.activePanel['anchor'], 'deselect');
      this.activePanel = {};
      this.togglePanel(anchor, clickedPanel);
    } else {
      this.togglePanel(anchor, clickedPanel);
    }

    // const tracksList = anchor.parentNode;
    // const allSavedTracks = anchor.parentNode.parentNode.children;
    // this.muteUnselectedTracks(allSavedTracks, tracksList);
  }

  togglePanel(collapsedAnchor, panel, action?) {
    if (action === 'close') {
      this.toggleHighlight(collapsedAnchor, 'deselect');
      panel.style.display = 'none';
      panel.style.maxHeight = null;
      panel.style.webkitTransition = 'max-height .2s ease-in-out';

      this.activePanel['opened'] = false;
    } else {
      this.toggleHighlight(collapsedAnchor);
      panel.style.display = 'flex';
      panel.style.maxHeight = panel.scrollHeight + '8' + 'px';
      panel.style.webkitTransition = 'max-height .2s ease-in-out';

      this.activePanel['element'] = panel;
      this.activePanel['opened'] = true;
      this.activePanel['anchor'] = collapsedAnchor;
    }
  }

  toggleHighlight(element, action?) {
    if (action === 'deselect') {
      element.classList.remove('highlighted');
    } else {
      element.classList.add('highlighted');
    }
  }

  muteUnselectedTracks(allSavedChildren, tracksList) {
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

}
