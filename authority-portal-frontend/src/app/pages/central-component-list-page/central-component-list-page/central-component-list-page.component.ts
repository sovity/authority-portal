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
import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import {Store} from '@ngxs/store';
import {
  CentralComponentDto,
  UserRoleDto,
} from '@sovity.de/authority-portal-client';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {HeaderBarConfig} from 'src/app/shared/common/header-bar/header-bar.model';
import {ConfirmationDialogComponent} from '../../../shared/common/confirmation-dialog/confirmation-dialog.component';
import {ConfirmationDialog} from '../../../shared/common/confirmation-dialog/confirmation-dialog.model';
import {
  DeleteCentralComponent,
  RefreshCentralComponents,
} from '../state/central-component-list-page-actions';
import {
  CentralComponentListPageState,
  DEFAULT_CENTRAL_COMPONENT_LIST_PAGE_STATE,
} from '../state/central-component-list-page-state';
import {CentralComponentListPageStateImpl} from '../state/central-component-list-page-state-impl';

@Component({
  selector: 'app-central-component-list-page',
  templateUrl: './central-component-list-page.component.html',
})
export class CentralComponentListPageComponent implements OnInit, OnDestroy {
  @HostBinding('class.overflow-y-auto')
  @HostBinding('class.overflow-x-hidden')
  cls = true;

  state = DEFAULT_CENTRAL_COMPONENT_LIST_PAGE_STATE;

  headerConfig!: HeaderBarConfig;

  private ngOnDestroy$ = new Subject();

  constructor(
    private store: Store,
    private globalStateUtils: GlobalStateUtils,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.refresh();
    this.startListeningToState();
    this.startRefreshingOnEnvChange();
    this.initializeHeaderBar();
  }

  refresh() {
    this.store.dispatch(RefreshCentralComponents);
  }

  initializeHeaderBar() {
    this.headerConfig = {
      title: 'Central Components',
      subtitle: 'List of Central Dataspace Components registered at the DAPS.',
      headerActions: [
        {
          label: 'Provide Central Component',
          action: () =>
            this.router.navigate(['/operator/central-components/provide']),
          permissions: [UserRoleDto.OperatorAdmin],
        },
      ],
    };
  }

  openUrl(url: string | undefined) {
    if (!url) {
      return;
    }
    window.open(url, '_blank');
  }

  showDeleteModal(centralComponent: CentralComponentDto) {
    const data: ConfirmationDialog = {
      title: `Delete Central Component`,
      messageBody: `Central Component '${centralComponent.name}' with ID '${centralComponent.centralComponentId}' will be unregistered from the DAPS.`,
      actionButtons: [
        {
          action: 'DELETE',
          label: 'Delete',
          style: 'btn-accent-danger',
        },
      ],
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: window.innerWidth > 640 ? '40%' : '60%',
      data: data,
    });
    dialogRef
      .afterClosed()
      .pipe(filter((it) => it === 'DELETE'))
      .subscribe(() =>
        this.store.dispatch(new DeleteCentralComponent(centralComponent)),
      );
  }

  private startListeningToState() {
    this.store
      .select<CentralComponentListPageState>(CentralComponentListPageStateImpl)
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
      });
  }

  private startRefreshingOnEnvChange() {
    this.globalStateUtils.onDeploymentEnvironmentChangeSkipFirst({
      ngOnDestroy$: this.ngOnDestroy$,
      onChanged: () => {
        this.refresh();
      },
    });
  }

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
