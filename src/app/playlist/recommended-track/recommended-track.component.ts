import { Component} from '@angular/core';
import { SavedTrackComponent } from '../saved-track/saved-track.component';

@Component({
  selector: 'app-recommended-track',
  templateUrl: './recommended-track.component.html',
  styleUrls: ['./recommended-track.component.css']
})
export class RecommendedTrackComponent extends SavedTrackComponent {

  constructor() {
    super();
   }

}
