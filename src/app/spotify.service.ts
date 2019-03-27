import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { URLSearchParams } from '@angular/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private authURL = 'https://accounts.spotify.com/authorize';
  private spotifyURL = 'https://api.spotify.com/v1/';

  // private httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   })
  // };

  constructor(private httpClient: HttpClient) {
  }

  public getUser(token): Observable<any> {
    const uri = 'me';
    return this.get(uri, token);
  }

  public getArtistId(artist, token) {
    const uri = `search?q=${artist}&type=artist&limit=1`;
  }

  public getSavedTracks(token): Observable<any> {
    const uri = 'me/tracks?limit=24';
    return this.get(uri, token);
  }

  public getRecommendations(id, token) {
    const uri = `recommendations?limit=5&market=US&seed_artists=${id}`;

  }


  private get(endpoint: string, token: string) {
    return this.httpClient
      .get(this.spotifyURL + endpoint, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .pipe(catchError(this.handleError));
  }

  private post(endpoint: string, token: string, body) {
    return this.httpClient
      .post(this.spotifyURL + endpoint, body, {
        headers: { Authorization: 'Bearer ' + token }
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let userMessage;
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
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

  public setToken(token_fragment) {
    localStorage.removeItem('spotifyToken');
    localStorage.removeItem('timestamp');

    const hash = token_fragment
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
