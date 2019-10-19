import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaylistComponent } from './playlist.component';
import { SavedTrackComponent } from './saved-track/saved-track.component';

@NgModule({
  declarations: [
    PlaylistComponent,
    SavedTrackComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PlaylistComponent
  ],
})

export class PlaylistModule { }
