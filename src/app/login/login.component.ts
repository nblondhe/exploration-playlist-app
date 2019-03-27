import { Component, OnInit} from '@angular/core';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit() {
  }

  signIn() {
    this.spotifyService.login();
  }
}
