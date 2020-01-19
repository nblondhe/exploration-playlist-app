import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { take, mergeMap, map } from 'rxjs/operators';
// import { url } from 'inspector';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    let intendedUrl: string = state.url.split('#')[0];
    return this.authenticate(intendedUrl, state.root.fragment);
  }
  
  authenticate(url: string, fragment?: string) {
    if (fragment) {
      this.authService.setToken(fragment);
      return true;
    }
    else if (this.authService.hasValidToken()) { 
      return true; 
    }
    else {
      this.authService.redirectUrl = url;

      this.router.navigate(['']);
      return false;
    }

  }
}
