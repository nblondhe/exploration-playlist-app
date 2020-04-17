import { Component} from '@angular/core';
import { AuthService } from '../auth/auth.service';

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
