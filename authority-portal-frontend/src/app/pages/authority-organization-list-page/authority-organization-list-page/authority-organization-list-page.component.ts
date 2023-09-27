import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Store} from '@ngxs/store';
import {OrganizationOverviewEntryDtoRegistrationStatusEnum} from '@sovity.de/authority-portal-client';
import {ApiService} from '../../../core/api/api.service';
import {getOrganizationRegistrationStatusClasses} from '../../../core/utils/ui-utils';
import {RefreshOrganizations} from '../state/authority-organization-list-page-actions';
import {
  AuthorityOrganizationListPageState,
  DEFAULT_AUTHORITY_ORGANIZATION_LIST_PAGE_STATE,
} from '../state/authority-organization-list-page-state';
import {AuthorityOrganizationListPageStateImpl} from '../state/authority-organization-list-page-state-impl';

@Component({
  selector: 'app-authority-organization-list-page',
  templateUrl: './authority-organization-list-page.component.html',
})
export class AuthorityOrganizationListPageComponent
  implements OnInit, OnDestroy
{
  state = DEFAULT_AUTHORITY_ORGANIZATION_LIST_PAGE_STATE;
  filter: OrganizationOverviewEntryDtoRegistrationStatusEnum | null = null;

  // html doesn't see this function if it's just imported
  getOrganizationRegistrationStatusClasses =
    getOrganizationRegistrationStatusClasses;

  constructor(private store: Store, private apiService: ApiService) {}

  ngOnInit() {
    this.refresh();
    this.startListeningToState();
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
      });
  }

  filterBy(filter: OrganizationOverviewEntryDtoRegistrationStatusEnum | null) {
    this.filter = filter;
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
