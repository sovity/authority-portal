import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {
  RefreshOrganizationUser,
  SetOrganizationUserId,
} from 'src/app/pages/authority-organization-user-detail-page/state/authority-organization-user-detail-page-actions';
import {
  AuthorityOrganizationUserDetailPageState,
  DEFAULT_AUTHORITY_ORGANIZATION_USER_DETAIL_PAGE_STATE,
} from 'src/app/pages/authority-organization-user-detail-page/state/authority-organization-user-detail-page-state';
import {AuthorityOrganizationUserDetailPageStateImpl} from 'src/app/pages/authority-organization-user-detail-page/state/authority-organization-user-detail-page-state-impl';

@Component({
  selector: 'app-authority-organization-user-detail-page',
  templateUrl: './authority-organization-user-detail-page.component.html',
})
export class AuthorityOrganizationUserDetailPageComponent
  implements OnInit, OnDestroy
{
  state = DEFAULT_AUTHORITY_ORGANIZATION_USER_DETAIL_PAGE_STATE;
  ngOnDestroy$ = new Subject();

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.setOrganizationUserId(params.get('mdsId')!!, params.get('userId')!!);
      this.refresh();
    });
    this.startListeningToState();
  }

  startListeningToState() {
    this.store
      .select<AuthorityOrganizationUserDetailPageState>(
        AuthorityOrganizationUserDetailPageStateImpl,
      )
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
      });
  }

  setOrganizationUserId(mdsId: string, userId: string) {
    this.store.dispatch(new SetOrganizationUserId(mdsId, userId));
  }

  refresh() {
    this.store.dispatch(RefreshOrganizationUser);
  }
  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
