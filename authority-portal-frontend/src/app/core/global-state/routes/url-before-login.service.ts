import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter, first, tap} from 'rxjs';

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
            event.url != null &&
            event.url != undefined &&
            event.url != '' &&
            event.url != '/' &&
            event.url != '/random-redirect-for-force-refresh',
        ),
        first(),
      )
      .subscribe((event) => {
        console.log('UrlBeforeLoginService: Original URL:', event.url);
        this.originalUrl = event.urlAfterRedirects || event.url;
        localStorage.setItem('originalUrl', this.originalUrl);
      });
  }

  public reset(): void {
    this.originalUrl = '';
  }

  public goToOriginalUrl(): void {
    if (this.originalUrl) {
      this.router.navigateByUrl(this.originalUrl);
      this.reset();
    }
  }
}
