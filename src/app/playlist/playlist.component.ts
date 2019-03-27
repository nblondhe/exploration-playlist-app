import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

  public spotifyUser: string;
  public savedTracks = [];

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit() {
    const token = localStorage.getItem('spotifyToken');
    this.spotifyService.getUser(token)
      .subscribe(user => {
        console.log(user);
        this.spotifyUser = user['display_name'];
      });

    this.spotifyService.getSavedTracks(token).subscribe(data => {
      console.log(data);
      this.savedTracks = data['items'].map(track => (
        {
          artists: track['track']['artists'],
          track: track['track']['name'],
          coverLow: track['track']['album']['images'][2]['url'],
          coverHigh: track['track']['album']['images'][0]['url'],
          id: track['track']['id']
        }
      ));
    });
  }

  updateDetail(i) {
    console.log(i);
  }

}
