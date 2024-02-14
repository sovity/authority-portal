import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subject, distinctUntilChanged, map, takeUntil, tap} from 'rxjs';
import {Store} from '@ngxs/store';
import {
  MemberInfo,
  OrganizationDetailsDto,
} from '@sovity.de/authority-portal-client';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {getOrganizationRegistrationStatusClasses} from 'src/app/core/utils/ui-utils';
import {
  ChildComponentInput,
  NavigationType,
} from 'src/app/shared/components/common/slide-over/slide-over.model';
import {
  TitleBarConfig,
  TitleBarMenuActionEvent,
} from 'src/app/shared/components/common/title-bar/title-bar.model';
import {SlideOverService} from 'src/app/shared/services/slide-over.service';
import {CloseOrganizationDetail} from '../../authority-organization-list-page/state/authority-organization-list-page-actions';
import {
  ApproveOrganization,
  DeactivateUser,
  ReactivateUser,
  RefreshOrganization,
  RejectOrganization,
  SetOrganizationMdsId,
} from '../state/authority-organization-detail-page-actions';
import {
  AuthorityOrganizationDetailPageState,
  DEFAULT_AUTHORITY_ORGANIZATION_DETAIL_PAGE_STATE,
} from '../state/authority-organization-detail-page-state';
import {AuthorityOrganizationDetailPageStateImpl} from '../state/authority-organization-detail-page-state-impl';
import {
  AuthorityOrganizationActions,
  AuthorityOrganizationDetailTab,
  AuthorityOrganizationUserActions,
  UserDetailPageConfig,
} from './authority-organization-detail-page.model';

@Component({
  selector: 'app-organization-detail-page',
  templateUrl: './authority-organization-detail-page.component.html',
})
export class AuthorityOrganizationDetailPageComponent
  implements OnInit, OnDestroy
{
  state = DEFAULT_AUTHORITY_ORGANIZATION_DETAIL_PAGE_STATE;
  organizationId!: string;
  organization!: OrganizationDetailsDto;
  titleBarConfig!: TitleBarConfig;
  slideOverContent!: AuthorityOrganizationDetailTab;
  userDetailPageConfig!: UserDetailPageConfig;

  constructor(
    private store: Store,
    @Inject('childComponentInput') childComponentInput: ChildComponentInput,
    private globalStateUtils: GlobalStateUtils,
    private slideOverService: SlideOverService,
  ) {
    this.organizationId = childComponentInput.id;
  }

  // html doesn't see this function if it's just imported
  getOrganizationRegistrationStatusClasses =
    getOrganizationRegistrationStatusClasses;

  ngOnInit() {
    this.setOrganizationMdsId(this.organizationId);
    this.refresh();
    this.startListeningToState();
    this.startListeningToSlideOverState();
    this.startRefreshingOnEnvChange();
  }

  startListeningToState() {
    this.store
      .select<AuthorityOrganizationDetailPageState>(
        AuthorityOrganizationDetailPageStateImpl,
      )
      .pipe(
        takeUntil(this.ngOnDestroy$),
        tap((state) => (this.state = state)),
        map((state) => state.organizationDetail), // Extract organizationDetail from the state
        distinctUntilChanged(),
      ) // Ensure that the organizationDetail has changed)
      .subscribe((response) => {
        if (this.state.organizationDetail.organization.isReady) {
          this.organization = response.organization.data;
          this.slideOverService.setSlideOverViews(
            {viewName: AuthorityOrganizationDetailTab.DETAIL},
            {viewName: ''},
          ); // once the organization is loaded, starts the slide-over state
        }
      });
  }

  /**
   * Based on the slide-over state actions handles change in the slide-over component
   */
  startListeningToSlideOverState() {
    this.slideOverService.slideOverState$
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        if (this.organization) {
          this.setupOrganizationTitleBar(this.organization);
          this.slideOverContent = state.currentView
            .viewName as AuthorityOrganizationDetailTab; // default view is the organization detail page
        }
      });
  }

  startRefreshingOnEnvChange() {
    this.globalStateUtils.onDeploymentEnvironmentChangeSkipFirst({
      ngOnDestroy$: this.ngOnDestroy$,
      onChanged: () => {
        this.refresh();
      },
    });
  }

  setOrganizationMdsId(mdsId: string) {
    this.store.dispatch(new SetOrganizationMdsId(mdsId));
  }

  /**
   * initialize the title bar component based on organization details
   * @param organization
   */
  setupOrganizationTitleBar(organization: OrganizationDetailsDto) {
    this.titleBarConfig = {
      title: organization.name,
      icon: 'building-office',
      status: organization.registrationStatus,
      statusStyle: this.getOrganizationRegistrationStatusClasses(
        organization.registrationStatus,
      ),
      tabs: [
        {
          view: AuthorityOrganizationDetailTab.DETAIL,
          icon: 'info',
          isDisabled: false,
        },
        {
          view: AuthorityOrganizationDetailTab.MEMBERS,
          icon: 'group',
          isDisabled: organization.memberCount === 0,
          value: organization.memberCount,
        },
        {
          view: AuthorityOrganizationDetailTab.CONNECTORS,
          icon: 'power',
          isDisabled: true, // no page associated yet
          value: organization.connectorCount,
        },
        {
          view: AuthorityOrganizationDetailTab.DATA_OFFERS,
          icon: 'article',
          isDisabled: true, // no page associated yet
          value: organization.dataOfferCount,
        },
      ],
      actionMenu: {
        id: 'actionMenu',
        menuOptions: [
          {
            label: 'Approve Participant',
            icon: 'check',
            event: AuthorityOrganizationActions.APPROVE_ORGANIZATION,
            isDisabled: ['ACTIVE', 'REJECTED'].includes(
              organization.registrationStatus,
            ),
          },
          {
            label: 'Reject Participant',
            icon: 'close',
            event: AuthorityOrganizationActions.REJECT_ORGANIZATION,
            isDisabled: ['ACTIVE', 'REJECTED'].includes(
              organization.registrationStatus,
            ),
          },
        ],
      },
    };
  }

  /**
   * initialize the title bar component based on user details
   * @param user
   */
  setupUserTitleBar(user: MemberInfo) {
    this.titleBarConfig = {
      title: user.firstName + ' ' + user.lastName,
      icon: 'account-circle',
      status: '',
      statusStyle: '',
      tabs: [],
      actionMenu: {
        id: 'actionMenu',
        menuOptions: [
          {
            label: 'Re-Activate User',
            icon: 'verified',
            event: AuthorityOrganizationUserActions.REACTIVATE_USER,

            isDisabled: user.registrationStatus === 'ACTIVE',
          },
          {
            label: 'Deactivate User',
            icon: 'person_cancel',
            event: AuthorityOrganizationUserActions.DEACTIVATE_USER,

            isDisabled:
              user.registrationStatus === 'PENDING' ||
              user.registrationStatus === 'DEACTIVATED',
          },
        ],
      },
    };
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

  menuActionHandler(action: TitleBarMenuActionEvent) {
    switch (action.event) {
      case AuthorityOrganizationActions.APPROVE_ORGANIZATION: {
        this.store.dispatch(ApproveOrganization);
        break;
      }
      case AuthorityOrganizationActions.REJECT_ORGANIZATION: {
        this.store.dispatch(RejectOrganization);
        this.store.dispatch(CloseOrganizationDetail);
        break;
      }
      case AuthorityOrganizationUserActions.REACTIVATE_USER: {
        this.store.dispatch(
          new ReactivateUser(this.state.openedUserDetail.userId),
        );
        break;
      }
      case AuthorityOrganizationUserActions.DEACTIVATE_USER: {
        this.store.dispatch(
          new DeactivateUser(this.state.openedUserDetail.userId),
        );
        break;
      }
    }
  }

  /**
   *  Handles the tab navigation
   * @param viewType
   */
  tabChangeHandler(viewType: any) {
    let view = viewType as AuthorityOrganizationDetailTab;
    this.slideOverService.setSlideOverViews({viewName: view}, {viewName: ''});
  }

  /**
   * Handles the user detail info navigation form the member list
   * @param user
   */
  userSelectedHandler(user: MemberInfo) {
    this.slideOverService.setSlideOverViews(
      {
        viewName: AuthorityOrganizationDetailTab.USER_DETAILS,
        viewData: user.userId,
      },
      {viewName: AuthorityOrganizationDetailTab.MEMBERS},
    );
    this.slideOverService.setSlideOverNavigationType(NavigationType.GO_BACK);
    this.userDetailPageConfig = {
      userId: user.userId,
      mdsId: this.organizationId,
    };
    this.setupUserTitleBar(user);
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
