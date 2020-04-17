import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private config;

  constructor(private http: HttpClient) {}

  setConfig() {
    this.http
      .get('/.netlify/functions/getSettings')
      .toPromise()
      .then(data => {
        this.config = data;
      });
  }

  getConfig(): any {
    return this.config;
  }
}