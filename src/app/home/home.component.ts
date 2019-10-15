import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  logged_in = false;
  tokenExpirey = 3600;

  constructor(private activatedRoute: ActivatedRoute,
              private spotifyService: SpotifyService) { }

  ngOnInit() {
    if (this.isValidToken()) {
      this.logged_in = true;
    }

    // If route has been called from Spotify auth redirect
    this.activatedRoute.fragment.subscribe(fragment => {
      if (fragment) {
        this.logged_in = this.spotifyService.setToken(fragment);
      }
    });
  }

  isValidToken() {
    const token = localStorage.getItem('spotifyToken');
    if (token) {
      const tokenDate = new Date(JSON.parse(localStorage.getItem('timestamp')));
      const expiredDate = tokenDate.setSeconds(tokenDate.getSeconds() + this.tokenExpirey);
      const now = new Date().getTime();

      const valid = now < expiredDate;
      return valid;
    } else {
      return false;
    }
  }

}
