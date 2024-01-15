import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {
  DeactivateUser,
  ReactivateUser,
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
  roleFormLoading: boolean = false;
  pageData!: {mdsId: string; userId: string};

  ngOnDestroy$ = new Subject();

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.pageData = {
        mdsId: params.get('mdsId')!!,
        userId: params.get('userId')!!,
      };
      this.setOrganizationUserId(this.pageData.mdsId, this.pageData.userId);
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
        this.roleFormLoading =
          this.state.userParticipantRolesForm.state === 'submitting' ||
          this.state.userApplicationRolesForm.state === 'submitting';
      });
  }

  setOrganizationUserId(mdsId: string, userId: string) {
    this.store.dispatch(new SetOrganizationUserId(mdsId, userId));
  }

  userActionHandler($event: any) {
    switch ($event.type) {
      case 'REACTIVATE':
        this.store.dispatch(new ReactivateUser(this.state.userId));
        break;
      case 'DEACTIVATE':
        this.store.dispatch(new DeactivateUser(this.state.userId));
        break;
    }
  }

  refresh() {
    this.store.dispatch(RefreshOrganizationUser);
  }

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
