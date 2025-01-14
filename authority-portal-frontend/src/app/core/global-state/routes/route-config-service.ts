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
  CATALOG_REDIRECTS,
  FEATURE_DASHBOARD_ROUTE,
  LOADING_ROUTES,
  ONBOARDING_ROUTES,
  PENDING_ROUTES,
  REJECTED_ROUTES,
  UNAUTHENTICATED_ROUTES,
} from '../../../app-routing.module';
import {ActiveFeatureSet} from '../../services/config/active-feature-set';
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

  readonly defaultRoute = '/catalog';

  constructor(
    private router: Router,
    private urlBeforeLoginService: UrlBeforeLoginService,
    private activeFeatureSet: ActiveFeatureSet,
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
    const routes = [...this.mapping[nextPageSet]];

    if (nextPageSet === 'AUTHORITY_PORTAL') {
      const rootRouteIndex = routes.findIndex((r) => r.path === '');

      if (rootRouteIndex !== -1) {
        const rootRoute = routes[rootRouteIndex];
        const existingChildren = rootRoute.children || [];

        // Add home route depending on feature set
        const newChildren = [...existingChildren, ...CATALOG_REDIRECTS];

        // Add additional routes depending on feature set & configuration
        if (this.activeFeatureSet.isDashboardEnabled()) {
          newChildren.push(...FEATURE_DASHBOARD_ROUTE);
        }

        routes[rootRouteIndex] = {
          ...rootRoute,
          children: newChildren,
        };
      }
    }

    this.router.resetConfig(routes);

    if (
      previousPageSet === 'ONBOARDING_PROCESS' &&
      nextPageSet === 'AUTHORITY_PORTAL'
    ) {
      this.router
        .navigateByUrl('/random-redirect-for-force-refresh', {
          skipLocationChange: true,
        })
        .then(() => {
          if (this.urlBeforeLoginService.originalUrl != '') {
            this.urlBeforeLoginService.goToOriginalUrl();
          } else {
            this.router.navigate([this.defaultRoute]);
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
