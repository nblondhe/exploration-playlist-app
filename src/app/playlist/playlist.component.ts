import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { SpotifyService } from '../spotify.service';
import { notificationAnimations, NotifAnimationState } from '../animations';
import { SavedTrack } from '../models/savedTrack';
import { SpotifyUser } from '../models/spotifyUser';
import { Track } from '../models/track';
import { RecommendedTrack } from '../models/recommendedTrack';
import { Notification } from '../models/notification';
import { SavedTrackComponent } from './saved-track/saved-track.component';
import { ActivatedRoute, Router } from '@angular/router';


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
  trackIds = [];
  currentTrack = {};
  animationState: NotifAnimationState = 'default';
  recsFetched: boolean;

  notifications = [];
  currentPlaylist = [];
  savedTracks: SavedTrack[];
  trackRecommendationMap: {[id: string]: Array<RecommendedTrack>; } = {};

  constructor(private spotifyService: SpotifyService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
                let validToken = false;
                window.location.hash = '';
               }

  // When making changes to ngFor collection,
  // DOM should only re-render the returned id - not all of collection
  trackById(i, id) {
    return i;
  }

  // TODO Subscribe chain could be refactored to mergemap/switchmap or other RXJS operator
  ngOnInit() {
   this.getData();
  }

  getData() {
    // TODO Get Token from service itself
    this.spotifyService.getUser()
      .subscribe(user => {
        this.spotifyUser = user;
      });
      this.getSavedTracks();
  }

  getSavedTracks() {
    this.spotifyService.getSavedTracks().subscribe(savedTracks => {
      this.savedTracks = savedTracks;
      this.currentTrack = this.savedTracks[0];
    },
      error => {
        if (error) {
          this.error = error;
        }
      },
      () => {
        this.savedTracks.forEach(track => {
          this.getRecommendations(track.id, [track.artists, track.track]);
        });
      }
    );
  }

  getRecommendations(id: string, basedOnAttributes: any[]) {
    this.spotifyService.getRecommendations(id, basedOnAttributes).subscribe(recommendedTracks => {
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
      this.spotifyService.createPlaylist(this.spotifyUser.id).subscribe(
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

    for (let i = 0; i < this.currentPlaylist.length; i++) {
      const trackId = this.currentPlaylist[i]['track']['id'];
      const lastSegment = tracks[tracks.length - 1];
      if (!lastSegment || lastSegment.length === chunkSize) {
        tracks.push(['spotify:track:' + trackId]);
      } else {
        lastSegment.push('spotify:track:' + trackId);
      }
    }

    tracks.forEach(segment => {
      this.spotifyService.buildPlaylist(this.spotifyUser.id, this.playlistId, segment)
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

    for (const baseTrackId in this.trackRecommendationMap) {
      if (this.trackRecommendationMap.hasOwnProperty(baseTrackId)) {
        for (let i = 0; i < this.trackRecommendationMap[baseTrackId].length; i++) {
          this.trackRecommendationMap[baseTrackId][i].addedToPlaylist = false;
        }
      }
    }
  }

  sendNotification(content: string, style: string) {
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
        element.style.background = '#75B3E7';
        element.style.boxShadow = '5px 6px 17px -15px #000';
        // 0px 5px 20px -15px
      } else {
        element.style.background = 'unset';
        element.style.boxShadow = 'unset';
      }
    }
  }


}
