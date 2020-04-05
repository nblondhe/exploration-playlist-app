import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LandingComponent } from './landing/landing.component';
import { AboutComponent } from './about/about.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { SavedTrackComponent } from './playlist/saved-track/saved-track.component';
import { RecommendedTrackComponent } from './playlist/recommended-track/recommended-track.component';
import { AuthGuard } from './auth/auth.guard';
import { LandingResolverService } from './landing-resolver.service';
import { LimitArtistsPipe } from './limit-artists.pipe';

const appRoutes: Routes = [
  { path: '', resolve: {authed: LandingResolverService}, component: HomeComponent, data: {animation: 'Home'}},
  { path: 'playlist', canActivate: [AuthGuard], component: PlaylistComponent},
  { path: 'about', component: AboutComponent, data: {animation: 'About'} },
];

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    HomeComponent,
    AboutComponent,
    PlaylistComponent,
    SavedTrackComponent,
    RecommendedTrackComponent,
    LimitArtistsPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false,
        anchorScrolling: 'enabled',
        onSameUrlNavigation: 'reload'
      }
    )
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
