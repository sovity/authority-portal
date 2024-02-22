import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Subject, distinctUntilChanged, map, takeUntil, tap} from 'rxjs';
import {Store} from '@ngxs/store';
import {
  MemberInfo,
  OrganizationDetailsDto,
  UserInfo,
} from '@sovity.de/authority-portal-client';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {getOrganizationRegistrationStatusClasses} from 'src/app/core/utils/ui-utils';
import {
  ChildComponentInput,
  NavigationType,
} from 'src/app/shared/components/common/slide-over/slide-over.model';
import {TitleBarConfig} from 'src/app/shared/components/common/title-bar/title-bar.model';
import {SlideOverService} from 'src/app/shared/services/slide-over.service';
import {CloseOrganizationDetail} from '../../authority-organization-list-page/state/authority-organization-list-page-actions';
import {
  ApproveOrganization,
  CheckDeleteUser,
  DeactivateUser,
  DeleteUser,
  ReactivateUser,
  RefreshOrganization,
  RejectOrganization,
  SetOrganizationMdsId,
  UpdateUserDeletionModalVisibility,
} from '../state/authority-organization-detail-page-actions';
import {
  AuthorityOrganizationDetailPageState,
  DEFAULT_AUTHORITY_ORGANIZATION_DETAIL_PAGE_STATE,
} from '../state/authority-organization-detail-page-state';
import {AuthorityOrganizationDetailPageStateImpl} from '../state/authority-organization-detail-page-state-impl';
import {
  AuthorityOrganizationDetailTab,
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
  deleteOrganizationCreatorForm = this.formBuilder.nonNullable.group({
    successor: ['', Validators.required],
  });
  currentUserId: string = '';

  constructor(
    private store: Store,
    @Inject('childComponentInput') childComponentInput: ChildComponentInput,
    private globalStateUtils: GlobalStateUtils,
    private slideOverService: SlideOverService,
    private formBuilder: FormBuilder,
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
    this.startListeningToCurrentUserId();
  }

  startListeningToCurrentUserId() {
    this.globalStateUtils.userInfo$
      .pipe(
        takeUntil(this.ngOnDestroy$),
        tap((info: UserInfo) => {
          this.currentUserId = info.userId;
        }),
      )
      .subscribe();
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
            event: () => this.store.dispatch(ApproveOrganization),
            isDisabled: ['ACTIVE', 'REJECTED'].includes(
              organization.registrationStatus,
            ),
          },
          {
            label: 'Reject Participant',
            icon: 'close',
            event: () => {
              this.store.dispatch(RejectOrganization);
              this.store.dispatch(CloseOrganizationDetail);
            },
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
            event: () =>
              this.store.dispatch(
                new ReactivateUser(this.state.openedUserDetail.userId),
              ),

            isDisabled: user.registrationStatus === 'ACTIVE',
          },
          {
            label: 'Deactivate User',
            icon: 'person_cancel',
            event: () =>
              this.store.dispatch(
                new DeactivateUser(this.state.openedUserDetail.userId),
              ),

            isDisabled:
              user.registrationStatus === 'PENDING' ||
              user.registrationStatus === 'DEACTIVATED',
          },
          {
            label: 'Delete User',
            icon: 'delete',
            event: () =>
              this.store.dispatch(
                new CheckDeleteUser(this.state.openedUserDetail.userId),
              ),
            isDisabled: user.userId === this.currentUserId,
          },
        ],
      },
    };
  }

  refresh() {
    return this.store.dispatch(RefreshOrganization);
  }

  approve() {
    this.store.dispatch(ApproveOrganization);
  }

  reject() {
    this.store.dispatch(RejectOrganization);
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

  isLastParticipantAdmin() {
    return (
      this.state.openedUserDetail.modalData?.data.isLastParticipantAdmin ??
      false
    );
  }

  isOrganizationCreator() {
    return (
      this.state.openedUserDetail.modalData?.data.isOrganizationCreator ?? false
    );
  }

  cancelDeleteUser() {
    this.store.dispatch(new UpdateUserDeletionModalVisibility(false));
    this.deleteOrganizationCreatorForm.reset();
  }

  confirmDeleteUser() {
    const successorId = this.deleteOrganizationCreatorForm.value.successor;

    this.deleteOrganizationCreatorForm.reset();
    this.store.dispatch(
      new DeleteUser(this.state.openedUserDetail.userId, successorId),
    );
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
