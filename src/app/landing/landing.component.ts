import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../spotify.service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {

  constructor(private authService: AuthService) { }

  signIn() {
    this.authService.getSpotifyToken();
  }
}
