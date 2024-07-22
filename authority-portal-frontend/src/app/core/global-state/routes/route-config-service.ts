/*
 * Copyright (c) 2024 sovity GmbH
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Contributors:
 *      sovity GmbH - initial implementation
 */
import {Injectable} from '@angular/core';
import {Router, Routes} from '@angular/router';
import {UserInfo} from '@sovity.de/authority-portal-client';
import {Fetched} from 'src/app/core/utils/fetched';
import {
  AUTHORITY_PORTAL_ROUTES,
  LOADING_ROUTES,
  ONBOARDING_ROUTES,
  PENDING_ROUTES,
  REJECTED_ROUTES,
  UNAUTHENTICATED_ROUTES,
} from '../../../app-routing.module';
import {AuthorityPortalPageSet} from './authority-portal-page-set';
import {UrlBeforeLoginService} from './url-before-login.service';

@Injectable({providedIn: 'root'})
export class RouteConfigService {
  mapping: Record<AuthorityPortalPageSet, Routes> = {
    LOADING: LOADING_ROUTES,
    UNAUTHENTICATED: UNAUTHENTICATED_ROUTES,
    REJECTED: REJECTED_ROUTES,
    PENDING: PENDING_ROUTES,
    ONBOARDING_PROCESS: ONBOARDING_ROUTES,
    AUTHORITY_PORTAL: AUTHORITY_PORTAL_ROUTES,
  };

  constructor(
    private router: Router,
    private urlBeforeLoginService: UrlBeforeLoginService,
  ) {}

  decidePageSet(userInfoFetched: Fetched<UserInfo>): AuthorityPortalPageSet {
    if (!userInfoFetched.isReady) {
      return 'LOADING';
    }

    const userInfo = userInfoFetched.data;
    if (userInfo.authenticationStatus === 'UNAUTHENTICATED') {
      return 'UNAUTHENTICATED';
    }

    switch (userInfo.registrationStatus) {
      case 'ACTIVE':
        return 'AUTHORITY_PORTAL';
      case 'ONBOARDING':
        return 'ONBOARDING_PROCESS';
      case 'PENDING':
        return 'PENDING';
      case 'REJECTED':
      default:
        return 'REJECTED';
    }
  }

  switchRouteConfig(
    previousPageSet: AuthorityPortalPageSet,
    nextPageSet: AuthorityPortalPageSet,
  ) {
    if (previousPageSet == nextPageSet) {
      return;
    }

    // Change routes
    this.router.resetConfig(this.mapping[nextPageSet]);

    if (
      previousPageSet === 'ONBOARDING_PROCESS' &&
      nextPageSet === 'AUTHORITY_PORTAL'
    ) {
      this.router
        .navigateByUrl('/random-redirect-for-force-refresh', {
          skipLocationChange: true,
        })
        .then(() => {
          console.log(
            'RouteConfigService: Redirecting to MDS Home or',
            this.urlBeforeLoginService.originalUrl,
          );
          if (this.urlBeforeLoginService.originalUrl != '') {
            this.urlBeforeLoginService.goToOriginalUrl();
          } else {
            this.router.navigate(['/mds-home']);
          }
        });
    } else {
      // Force refresh
      this.forceRefreshCurrentRoute();
    }
  }

  forceRefreshCurrentRoute() {
    const currentUrl = this.router.url;
    this.router
      .navigateByUrl('/random-redirect-for-force-refresh', {
        skipLocationChange: true,
      })
      .then(() => this.router.navigateByUrl(currentUrl));
  }
}
