import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {MemberInfo} from '@sovity.de/authority-portal-client';
import {BreadcrumbService} from '../../../common/layouts/portal-layout/breadcrumb/breadcrumb.service';
import {Reset} from '../state/control-center-organization-members-page-action';
import {
  ControlCenterOrganizationMembersPageState,
  DEFAULT_CONTROL_CENTER_ORGANIZATION_MEMBERS_PAGE_STATE,
} from '../state/control-center-organization-members-page-state';
import {ControlCenterOrganizationMembersPageStateImpl} from '../state/control-center-organization-members-page-state-impl';

@Component({
  selector: 'app-control-center-organization-members-page',
  templateUrl: './control-center-organization-members-page.component.html',
})
export class ControlCenterOrganizationMembersPageComponent
  implements OnInit, OnDestroy
{
  state: ControlCenterOrganizationMembersPageState =
    DEFAULT_CONTROL_CENTER_ORGANIZATION_MEMBERS_PAGE_STATE;

  constructor(
    private store: Store,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
  ) {}

  ngOnInit(): void {
    this.refresh();
    this.startListeningToState();
  }

  refresh(): void {
    this.store.dispatch(Reset);
  }

  startListeningToState(): void {
    this.store
      .select<ControlCenterOrganizationMembersPageState>(
        ControlCenterOrganizationMembersPageStateImpl,
      )
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
      });
  }

  onSelectUser(user: MemberInfo): void {
    this.breadcrumbService.addReplacement(
      user.userId,
      `${user.firstName} ${user.lastName}`,
    );
    this.router.navigate(['control-center/my-users', user.userId]);
  }

  ngOnDestroy$ = new Subject();
  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
