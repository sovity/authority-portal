import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Store} from '@ngxs/store';
import {UserApprovalPageResult} from '../../../../../../authority-portal-backend/authority-portal-api-client-ts';
import {ApiService} from '../../../core/api/api.service';
import {RefreshOrganizations} from '../state/organization-list-page-actions';
import {
  DEFAULT_ORGANIZATION_LIST_PAGE_STATE,
  OrganizationListPageState,
} from '../state/organization-list-page-state';
import {OrganizationListPageStateImpl} from '../state/organization-list-page-state-impl';

@Component({
  selector: 'app-organization-list-page',
  templateUrl: './organization-list-page.component.html',
})
export class OrganizationListPageComponent implements OnInit, OnDestroy {
  state = DEFAULT_ORGANIZATION_LIST_PAGE_STATE;

  uap: UserApprovalPageResult | null = null;

  constructor(private store: Store, private apiService: ApiService) {}

  ngOnInit() {
    this.refresh();
    this.startListeningToState();
    this.apiService.userApprovalPage().subscribe((uap) => (this.uap = uap));
  }

  refresh() {
    this.store.dispatch(RefreshOrganizations);
  }

  private startListeningToState() {
    this.store
      .select<OrganizationListPageState>(OrganizationListPageStateImpl)
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
      });
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
