import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Store} from '@ngxs/store';
import {OrganizationRegistrationStatusDto} from '@sovity.de/authority-portal-client';
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
  filter: OrganizationRegistrationStatusDto | null = null;

  // html doesn't see this function if it's just imported
  getOrganizationRegistrationStatusClasses =
    getOrganizationRegistrationStatusClasses;

  private ngOnDestroy$ = new Subject();

  constructor(private store: Store) {}

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

  filterBy(filter: OrganizationRegistrationStatusDto | null) {
    this.filter = filter;
  }

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
