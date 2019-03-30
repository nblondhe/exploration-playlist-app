import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })
export class JsonService {
  constructor(private http: HttpClient) { }

  getSavedTracks() {
    return this.http.get('./assets/savedTracksResults.json');
  }

  getRecs() {
    return this.http.get('./assets/recommendationResults.json');
  }
}