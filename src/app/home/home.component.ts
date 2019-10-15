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

  constructor(private activatedRoute: ActivatedRoute,
              private spotifyService: SpotifyService) { }

  ngOnInit() {
    if (this.isValidToken()) {
      this.logged_in = true;
    }
    this.activatedRoute.fragment.subscribe(fragment => {
      if (fragment) {
        this.logged_in = this.spotifyService.setToken(fragment);
      }
    });
  }

  isValidToken() {
    const token = localStorage.getItem('spotifyToken');
    if (token) {
      const tokenDate = JSON.parse(localStorage.getItem('timestamp'));
      const now = new Date().getTime().toString();
      const valid = now < ((3600) + tokenDate);
      return valid;
    } else {
      return false;
    }
  }

}
