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
import {
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {Subject, distinctUntilChanged, takeUntil} from 'rxjs';
import {map} from 'rxjs/operators';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {APP_CONFIG, AppConfig} from 'src/app/core/services/config/app-config';
import {ActiveFeatureSet} from '../../../../core/services/config/active-feature-set';
import {SidebarSection} from './sidebar.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit, OnDestroy {
  isExpandedMenu: boolean = true;
  sidebarSections: SidebarSection[] = [];
  private ngOnDestroy$ = new Subject();

  private homeUrl = this.activeFeatureSet.usesMdsId() ? '/mds-home' : '/home';

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private globalStateUtils: GlobalStateUtils,
    private activeFeatureSet: ActiveFeatureSet,
  ) {}

  ngOnInit() {
    this.startListeningToEnvironmentChanges();
  }

  startListeningToEnvironmentChanges(): void {
    this.globalStateUtils.userInfo$
      .pipe(
        map((it) => it.organizationName),
        distinctUntilChanged(),
        takeUntil(this.ngOnDestroy$),
      )
      .subscribe((organizationName) => {
        this.setSideBarSections(organizationName);
      });
  }

  // Listen for window resize events
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkWindowWidth();
  }

  // Function to check window width and update isExpandedMenu accordingly
  checkWindowWidth(): void {
    this.isExpandedMenu = window.innerWidth > 768; // Set the breakpoint as per your design
  }

  openNewTab() {
    window.open('mds-home', '_self');
  }

  setSideBarSections(organizationName: string): void {
    this.sidebarSections = [
      {
        title: this.activeFeatureSet.usesMdsId() ? 'MDS' : 'Home',
        userRoles: ['USER'],
        menus: [
          {
            title: 'Home',
            icon: 'home',
            rLink: 'mds-home',
          },
          {
            title: 'Dashboard',
            icon: 'dashboard',
            rLink: '/dashboard',
          },
          {
            title: this.activeFeatureSet.usesBritishCatalogue()
              ? 'Data Catalogue'
              : 'Data Catalog',
            icon: 'tag',
            rLink: '/catalog',
          },
        ],
      },
      {
        title: organizationName ?? 'My Organization',
        userRoles: ['USER'],
        menus: [
          {
            title: 'My Organization',
            icon: 'home',
            rLink: '/control-center/my-organization',
          },
          {
            title: 'My Data Offers',
            icon: 'tag',
            rLink: `/my-organization/data-offers`,
          },
          {
            title: 'My Connectors',
            icon: 'connector',
            rLink: '/my-organization/connectors',
          },
        ],
      },
      {
        title: 'Operator Section',
        userRoles: ['OPERATOR_ADMIN'],
        menus: [
          {
            title: 'All Connectors',
            icon: 'connector',
            rLink: '/operator/connectors',
          },
          {
            title: 'Central Components',
            icon: 'extension',
            rLink: '/operator/central-components',
          },
        ],
      },
      {
        title: 'Service Partner Section',
        userRoles: ['SERVICE_PARTNER_ADMIN'],
        menus: [
          {
            title: 'Provided Connectors',
            icon: 'connector',
            rLink: '/service-partner/provided-connectors',
          },
        ],
      },
      {
        title: 'Authority Section',
        userRoles: ['AUTHORITY_USER'],
        menus: [
          {
            title: 'Organizations',
            icon: 'building-office-2',
            rLink: '/authority/organizations',
          },
          {
            title: 'All Connectors',
            icon: 'connector',
            rLink: '/authority/connectors',
          },
        ],
      },
      {
        title: 'Support',
        userRoles: ['USER'],
        menus: [
          {
            title: this.activeFeatureSet.usesMdsId()
              ? 'MDS Support'
              : 'Support',
            icon: 'question-mark-circle',
            rLink: this.config.supportUrl,
            isExternalLink: true,
          },
        ],
      },
    ];
  }

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
