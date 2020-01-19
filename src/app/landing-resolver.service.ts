import { Injectable } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LandingResolverService implements Resolve<boolean> {

  constructor(private authService: AuthService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
      if (this.authService.hasValidToken()) {
        this.router.navigate(['playlist']);
        return EMPTY;
      }
      else {
        return of(true);
      }
  }
}
