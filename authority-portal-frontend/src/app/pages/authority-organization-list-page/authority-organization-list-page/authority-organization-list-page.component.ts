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
import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Store} from '@ngxs/store';
import {
  OrganizationOverviewEntryDto,
  OrganizationRegistrationStatusDto,
  UserRoleDto,
} from '@sovity.de/authority-portal-client';
import {SlideOverService} from 'src/app/core/services/slide-over.service';
import {sliderOverNavigation} from 'src/app/core/utils/helper';
import {getOrganizationRegistrationStatusClasses} from 'src/app/core/utils/ui-utils';
import {
  FilterBarConfig,
  FilterOption,
  FilterQuery,
} from 'src/app/shared/common/filter-bar/filter-bar.model';
import {HeaderBarConfig} from 'src/app/shared/common/header-bar/header-bar.model';
import {
  NavigationType,
  SlideOverAction,
  SlideOverConfig,
} from 'src/app/shared/common/slide-over/slide-over.model';
import {ActiveFeatureSet} from '../../../core/services/config/active-feature-set';
import {AuthorityOrganizationDetailPageComponent} from '../../authority-organization-detail-page/authority-organization-detail-page/authority-organization-detail-page.component';
import {AuthorityInviteNewOrganizationComponent} from '../authority-invite-new-organization/authority-invite-new-organization.component';
import {
  CloseOrganizationDetail,
  RefreshOrganizations,
  ShowOrganizationDetail,
} from './state/authority-organization-list-page-actions';
import {
  AuthorityOrganizationListPageState,
  DEFAULT_AUTHORITY_ORGANIZATION_LIST_PAGE_STATE,
} from './state/authority-organization-list-page-state';
import {AuthorityOrganizationListPageStateImpl} from './state/authority-organization-list-page-state-impl';

@Component({
  selector: 'app-authority-organization-list-page',
  templateUrl: './authority-organization-list-page.component.html',
})
export class AuthorityOrganizationListPageComponent
  implements OnInit, OnDestroy
{
  state = DEFAULT_AUTHORITY_ORGANIZATION_LIST_PAGE_STATE;

  showDetail: boolean = false;
  slideOverConfig!: SlideOverConfig;
  componentToRender = AuthorityOrganizationDetailPageComponent;
  filter: OrganizationRegistrationStatusDto | null = null;
  headerConfig!: HeaderBarConfig;
  filterBarConfig!: FilterBarConfig;

  // html doesn't see this function if it's just imported
  getOrganizationRegistrationStatusClasses =
    getOrganizationRegistrationStatusClasses;

  constructor(
    private store: Store,
    public dialog: MatDialog,
    private slideOverService: SlideOverService,
    public activeFeatureSet: ActiveFeatureSet,
  ) {}

  ngOnInit() {
    this.initializeHeaderBar();
    this.initializeFilterBar();
    this.refresh();
    this.startListeningToState();
  }

  initializeHeaderBar() {
    this.headerConfig = {
      title: 'Participant Management',
      subtitle: 'Manage all organizations and their users here',
      headerActions: [
        {
          label: 'Invite Organization',
          action: () => this.inviteOrganization(),
          permissions: [UserRoleDto.AuthorityAdmin, UserRoleDto.AuthorityUser],
        },
      ],
    };
  }

  initializeFilterBar() {
    this.filterBarConfig = {
      filters: [
        {
          id: 'status',
          label: 'Status',
          type: 'SELECT',
          icon: 'status',
          options: Object.values(OrganizationRegistrationStatusDto).map(
            (status) => {
              return {id: status, label: status};
            },
          ) as FilterOption[],
        },
      ],
    };
  }

  refresh() {
    this.store.dispatch(RefreshOrganizations);
  }

  private startListeningToState() {
    this.store
      .select<AuthorityOrganizationListPageState>(
        AuthorityOrganizationListPageStateImpl,
      )
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
        this.showDetail = state.showDetail;
      });
  }

  openDetailPage(organization: OrganizationOverviewEntryDto) {
    this.slideOverConfig = {
      childComponentInput: {
        id: organization.id,
      },
      label: organization.name,
      icon: 'organization',
      showNavigation: this.state.organizations.data.length > 1,
      navigationType: NavigationType.STEPPER,
    };
    this.slideOverService.setSlideOverConfig(this.slideOverConfig);
    this.store.dispatch(ShowOrganizationDetail);
  }

  handleFilter(event: FilterQuery) {
    this.filter = event['status'] as OrganizationRegistrationStatusDto;
  }

  handleNavigation(direction: SlideOverAction, currentConnectorId: string) {
    let totalOrganizations = this.state.organizations.data.length;
    let currentIndex = this.state.organizations.data.findIndex(
      (organization) => organization.id === currentConnectorId,
    );
    let nextIndex = sliderOverNavigation(
      direction,
      currentIndex,
      totalOrganizations,
    );
    this.slideOverConfig = {
      ...this.slideOverConfig,
      childComponentInput: {
        id: this.state.organizations.data[nextIndex].id,
      },
      label: this.state.organizations.data[nextIndex].name,
    };
    this.slideOverService.setSlideOverConfig(this.slideOverConfig);
  }

  closeDetailPage() {
    this.store.dispatch(CloseOrganizationDetail);
    this.slideOverService.slideOverReset();
  }

  inviteOrganization() {
    this.dialog.open(AuthorityInviteNewOrganizationComponent, {
      width: window.innerWidth > 640 ? '60%' : '100%',
    });
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy(): void {
    this.closeDetailPage();
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
