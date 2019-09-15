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
    this.activatedRoute.fragment.subscribe(fragment => {
      if (fragment) {
        this.logged_in = this.spotifyService.setToken(fragment);
      } else {
        const token = localStorage.getItem('spotifyToken');
        if (token) {
          if (!this.isExpired()) {
            this.logged_in = true;
          } else {
            this.spotifyService.login();
          }
        }
      }
    });
  }

  isExpired() {
    const tokenDate = JSON.parse(localStorage.getItem('timestamp'));
    const now = new Date().getTime().toString();
    const expired = now > ((1800) + tokenDate);
    return expired;
  }

}
