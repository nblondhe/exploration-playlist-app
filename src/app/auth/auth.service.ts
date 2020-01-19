import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authURL = 'https://accounts.spotify.com/authorize';
  redirectUrl: string;
  token: string;
  private tokenExpiry = 3600;

   getSpotifyToken() {
    const clientId = environment.config.SPOTIFY_CLIENT_ID;
    const redirectUri = environment.config.redirect_uri;
    const scopes = environment.config.scopes;

    // tslint:disable-next-line:max-line-length
    window.location.href = `${this.authURL}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token`;

  }

  setToken(tokenFragment) {
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
    
    this.token = hash['access_token'];
    localStorage.setItem('spotifyToken', this.token);
    localStorage.setItem('timestamp', JSON.stringify(new Date().getTime()));
  }

  hasValidToken() {
    const token = localStorage.getItem('spotifyToken');
    if (token) {
      const tokenDate = new Date(JSON.parse(localStorage.getItem('timestamp')));
      const expiredDate = tokenDate.setSeconds(tokenDate.getSeconds() + this.tokenExpiry);
      const now = new Date().getTime();
      const valid = now < expiredDate;

      return valid;
    } else {
      return false;
    }
  }

}