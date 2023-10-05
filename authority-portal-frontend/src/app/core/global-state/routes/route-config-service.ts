import {Injectable} from '@angular/core';
import {Router, Routes} from '@angular/router';
import {
  AUTHORITY_PORTAL_ROUTES,
  LOADING_ROUTES,
  REGISTRATION_PROCESS_ROUTES,
} from '../../../app-routing.module';
import {AuthorityPortalPageSet} from './authority-portal-page-set';

@Injectable({providedIn: 'root'})
export class RouteConfigService {
  mapping: Record<AuthorityPortalPageSet, Routes> = {
    LOADING: LOADING_ROUTES,
    AUTHORITY_PORTAL: AUTHORITY_PORTAL_ROUTES,
    REGISTRATION_PROCESS: REGISTRATION_PROCESS_ROUTES,
  };

  constructor(private router: Router) {}

  switchRouteConfig(
    previousPageSet: AuthorityPortalPageSet,
    nextPageSet: AuthorityPortalPageSet,
  ) {
    if (previousPageSet == nextPageSet) {
      return;
    }

    // Change routes
    this.router.resetConfig(this.mapping[nextPageSet]);

    // Force refresh
    this.forceRefreshCurrentRoute();
  }

  forceRefreshCurrentRoute() {
    const currentUrl = this.router.url;
    this.router
      .navigateByUrl('/random-redirect-for-force-refresh', {
        skipLocationChange: true,
      })
      .then(() => this.router.navigate([currentUrl]));
  }
}
