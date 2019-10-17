import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from './../environments/environment';

import { SavedTrack } from './savedTrack';
import { RecommendedTrack } from './recommendedTrack';
import { SpotifyUser } from './spotifyUser';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private authURL = 'https://accounts.spotify.com/authorize';
  private spotifyURL = 'https://api.spotify.com/v1/';

  constructor(private httpClient: HttpClient) {
  }

  public getUser(token): Observable<SpotifyUser> {
    const endpoint = 'me';
    return this.httpClient
    .get<string>(this.spotifyURL + endpoint, {
      headers: { Authorization: 'Bearer ' + token }
    })
    .pipe(
      map(user => new SpotifyUser(
        user['id'],
        user['display_name']
      )),
      catchError(this.handleError));
  }

  public getSavedTracks(token: string): Observable<SavedTrack[]> {
    const endpoint = 'me/tracks?limit=24';
    return this.httpClient
      .get<SavedTrack[]>(this.spotifyURL + endpoint, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .pipe(
        map(tracks => tracks['items'].map(track => new SavedTrack(
          track['track']['id'],
          track['track']['artists'],
          track['track']['name'],
          track['track']['album']['name'],
          track['track']['album']['images'][2]['url'],
          track['track']['album']['images'][0]['url'],
          new Date(track['track']['album']['release_date']),
          new Date(track['added_at']),
          track['track']['album']['id'],
        ),
        )),
        catchError(this.handleError));
  }

  public getRecommendations(id, attributes, token): Observable<RecommendedTrack[]> {
    const basedOn = attributes[1] + ' - ' + attributes[0][0]['name'];
    const endpoint = `recommendations?limit=5&market=US&seed_tracks=${id}`;
    return this.httpClient.get<RecommendedTrack[]>(this.spotifyURL + endpoint, {
      headers: { Authorization: 'Bearer ' + token }
    })
    .pipe(
      map(tracks => tracks['tracks'].map(track => new RecommendedTrack(
        track['id'],
        track['artists'],
        track['name'],
        track['album']['name'],
        track['album']['images'][2]['url'],
        track['album']['images'][0]['url'],
        new Date(track['album']['release_date']),
        basedOn,
        id,
      ),
      )),
      catchError(this.handleError));
  }

  public createPlaylist(id, token): Observable<string> {
      const body = {
        name: 'Exploration',
        description: 'Curated by you. exploration-app.netlify.com',
        public: false
      };
      const endpoint = `users/${id}/playlists`;
      return this.httpClient
      .post<string>(this.spotifyURL + endpoint, body, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .pipe(
        map(result => result['id']),
        catchError(this.handleError));
  }

  // OLD API?
  public buildPlaylist(id, playlistId, token, segment): Observable<string> {
    const body = {
      uris: segment
    };
    const endpoint = `users/${id}/playlists/${playlistId}/tracks?`;
    return this.httpClient
      .post<string>(this.spotifyURL + endpoint, body, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .pipe(
        map(result => result['snapshot_id']),
        catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);
    let userMessage;
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      console.error('An error occurred:', error.error.message);
    } else {
      const spotifyError = error.error.error;
      console.log('full error', error);
      if (spotifyError.message.toLowerCase() === 'the access token expired') {
        userMessage = 'Your token has expired, please return to the login page';
      } else {
        console.error(
          `Backend returned code ${error.status}, ` + `body was: ${error.error}`
          );
      }
    }
    return throwError(userMessage);
  }

  public login() {
    const clientId = environment.config.SPOTIFY_CLIENT_ID;
    const redirectUri = environment.config.redirect_uri;
    const scopes = environment.config.scopes;

    // tslint:disable-next-line:max-line-length
    window.location.href = `${this.authURL}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token`;
  }

  public setToken(tokenFragment) {
    // Remove previous token
    localStorage.removeItem('spotifyToken');
    localStorage.removeItem('timestamp');

    const hash = tokenFragment
      .substring()
      .split('&')
      .reduce(function (initial, item) {
        if (item) {
          const parts = item.split('=');
          initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
      }, {});

    window.location.hash = '';

    localStorage.setItem('spotifyToken', hash['access_token']);
    localStorage.setItem('timestamp', JSON.stringify(new Date().getTime()));
    return true;
  }

}
