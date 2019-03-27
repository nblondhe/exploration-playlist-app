import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit() {
  }

  signIn() {
    this.spotifyService.login();
  }
}
