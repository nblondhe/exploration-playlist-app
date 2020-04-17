import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Settings {
  SPOTIFY_CLIENT_ID: string,
  SPOTIFY_SCOPES: string,
  REDIRECT_URI: string
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authURL = 'https://accounts.spotify.com/authorize';
  redirectUrl: string;
  token: string;
  private tokenExpiry = 3600;

  constructor(private http: HttpClient) {}

   getSpotifyToken() {
    this.http.get('/.netlify/functions/getSettings')
      .subscribe((settings: Settings)  => {
        window.location.href = `${this.authURL}?client_id=${settings.SPOTIFY_CLIENT_ID}&redirect_uri=${settings.REDIRECT_URI}&scope=${settings.SPOTIFY_SCOPES}&response_type=token`;
      });
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