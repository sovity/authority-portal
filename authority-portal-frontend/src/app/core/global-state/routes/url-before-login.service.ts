import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter, first} from 'rxjs';

@Injectable({
  providedIn: 'root', // Ensure the service is provided in the root injector
})
export class UrlBeforeLoginService {
  public originalUrl: string = '';

  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd =>
            event instanceof NavigationEnd &&
            event.url !== '/random-redirect-for-force-refresh',
        ),
        // first(),
      )
      .subscribe((event) => {
        this.originalUrl = event.urlAfterRedirects || event.url;
        console.log('Original URL:', this.originalUrl);
      });
  }

  public reset(): void {
    this.originalUrl = '';
  }
}
