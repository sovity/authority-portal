import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {getOrganizationRegistrationStatusClasses} from 'src/app/core/utils/ui-utils';
import {
  ApproveOrganization,
  RefreshOrganization,
  RejectOrganization,
  SetOrganizationMdsId,
} from '../state/authority-organization-detail-page-actions';
import {
  AuthorityOrganizationDetailPageState,
  DEFAULT_AUTHORITY_ORGANIZATION_DETAIL_PAGE_STATE,
} from '../state/authority-organization-detail-page-state';
import {AuthorityOrganizationDetailPageStateImpl} from '../state/authority-organization-detail-page-state-impl';

@Component({
  selector: 'app-authority-organization-detail-page',
  templateUrl: './authority-organization-detail-page.component.html',
})
export class AuthorityOrganizationDetailPageComponent
  implements OnInit, OnDestroy
{
  state = DEFAULT_AUTHORITY_ORGANIZATION_DETAIL_PAGE_STATE;

  // html doesn't see this function if it's just imported
  getOrganizationRegistrationStatusClasses =
    getOrganizationRegistrationStatusClasses;

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.setOrganizationMdsId(params.get('mdsId')!!);
      this.refresh();
    });

    this.startListeningToState();
  }

  private startListeningToState() {
    this.store
      .select<AuthorityOrganizationDetailPageState>(
        AuthorityOrganizationDetailPageStateImpl,
      )
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
      });
  }

  setOrganizationMdsId(mdsId: string) {
    this.store.dispatch(new SetOrganizationMdsId(mdsId));
  }

  refresh() {
    this.store.dispatch(RefreshOrganization);
  }

  approve() {
    this.store.dispatch(ApproveOrganization);
  }

  reject() {
    this.store.dispatch(RejectOrganization);
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
