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
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { CatalogDataOffer, CatalogPageSortingItem } from '@sovity.de/authority-portal-client';
import { GlobalStateUtils } from 'src/app/core/global-state/global-state-utils';
import { LocalStoredValue } from 'src/app/core/utils/local-stored-value';
import { HeaderBarConfig } from '../../../shared/common/header-bar/header-bar.model';
import { AssetDetailDialogService } from '../asset-detail-dialog/asset-detail-dialog.service';
import { FilterBoxItem } from '../filter-box/filter-box-item';
import { FilterBoxVisibleState } from '../filter-box/filter-box-visible-state';
import { ViewModeEnum, isViewMode } from '../view-selection/view-mode-enum';
import { CatalogActiveFilterPill } from './state/catalog-active-filter-pill';
import { CatalogPage } from './state/catalog-page-actions';
import { CatalogPageState } from './state/catalog-page-state';
import { CatalogPageStateModel } from './state/catalog-page-state-model';


@Component({
  selector: 'catalog-page',
  templateUrl: './catalog-page.component.html',
})
export class CatalogPageComponent implements OnInit, OnDestroy {
  @HostBinding('class.flex')
  cls = true;

  headerConfig: HeaderBarConfig = {
    title: 'Catalog',
    subtitle: 'Catalog of public Data Offers of all participants',
    headerActions: [],
  };

  state!: CatalogPageStateModel;
  searchText = new FormControl('');
  sortBy = new FormControl<CatalogPageSortingItem | null>(null);
  viewModeEnum = ViewModeEnum;
  viewMode = new LocalStoredValue<ViewModeEnum>(
    ViewModeEnum.GRID,
    'brokerui.viewMode',
    isViewMode,
  );

  // only tracked to prevent the component from resetting
  expandedFilterId = '';

  constructor(
    private assetDetailDialogService: AssetDetailDialogService,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  ngOnInit(): void {
    this.initializePage();
    this.startListeningToStore();
    this.startListeningToEnvironmentChanges();
    this.startEmittingSearchText();
    this.startEmittingSortBy();
  }

  private initializePage() {
    const mdsIds = this.parseMdsId(this.route.snapshot.queryParams);
    this.store.dispatch(new CatalogPage.Reset(mdsIds));

    if (mdsIds.length) {
      this.expandedFilterId = 'mdsId';
      // remove query params from url
      this.router.navigate([]);
    }
  }

  private startListeningToStore() {
    this.store
      .select<CatalogPageStateModel>(CatalogPageState)
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
        if (this.searchText.value != state.searchText) {
          this.searchText.setValue(state.searchText);
        }
        if (this.sortBy.value?.sorting !== state.activeSorting?.sorting) {
          this.sortBy.setValue(state.activeSorting);
        }
        if (!this.expandedFilterId && this.state.fetchedData.isReady) {
          this.expandedFilterId =
            this.state.fetchedData.data.availableFilters.fields[0].id;
        }
      });
  }

  private startEmittingSearchText() {
    this.searchText.valueChanges
      .pipe(map((value) => value ?? ''))
      .subscribe((searchText) => {
        if (searchText != this.state.searchText) {
          this.store.dispatch(new CatalogPage.UpdateSearchText(searchText));
        }
      });
  }

  private startEmittingSortBy() {
    this.sortBy.valueChanges
      .pipe(map((value) => value ?? null))
      .subscribe((value) => {
        if (value?.sorting !== this.state.activeSorting?.sorting) {
          this.store.dispatch(new CatalogPage.UpdateSorting(value));
        }
      });
  }

  private parseMdsId(params: Params): string[] {
    if (!('mdsId' in params)) {
      return [];
    }
    const mdsIds = params.mdsId;
    return Array.isArray(mdsIds) ? [...new Set(mdsIds)] : [mdsIds];
  }

  onDataOfferClick(dataOffer: CatalogDataOffer) {
    this.assetDetailDialogService
      .open(dataOffer.assetId, dataOffer.connectorId, this.ngOnDestroy$)
      .subscribe();
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }

  onSelectedItemsChange(
    filter: FilterBoxVisibleState,
    newSelectedItems: FilterBoxItem[],
  ) {
    this.store.dispatch(
      new CatalogPage.UpdateFilterSelectedItems(
        filter.model.id,
        newSelectedItems,
      ),
    );
  }

  onSearchTextChange(filter: FilterBoxVisibleState, newSearchText: string) {
    this.store.dispatch(
      new CatalogPage.UpdateFilterSearchText(filter.model.id, newSearchText),
    );
  }

  onRemoveActiveFilterItem(item: CatalogActiveFilterPill) {
    this.store.dispatch(new CatalogPage.RemoveActiveFilterItem(item));
  }

  onPageChange(event: PageEvent) {
    this.store.dispatch(new CatalogPage.UpdatePage(event.pageIndex));
  }

  onExpandedFilterChange(filterId: string, expanded: boolean) {
    if (expanded) {
      this.expandedFilterId = filterId;
    }
  }

  private startListeningToEnvironmentChanges() {
    this.globalStateUtils.onDeploymentEnvironmentChangeSkipFirst({
      onChanged: () => this.store.dispatch(new CatalogPage.EnvironmentChange()),
      ngOnDestroy$: this.ngOnDestroy$,
    });
  }
}
