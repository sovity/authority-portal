import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {
  InviteParticipantUserRequest,
  UserRoleDto,
} from '@sovity.de/authority-portal-client';
import {APP_CONFIG, AppConfig} from 'src/app/core/config/app-config';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {InviteNewUser} from '../state/participant-invite-new-user-page-actions';
import {
  DEFAULT_PARTICIPANT_INVITE_NEW_USER_PAGE_STATE,
  ParticipantInviteNewUserPageState,
} from '../state/participant-invite-new-user-page-state';
import {ParticipantInviteNewUserPageStateImpl} from '../state/participant-invite-new-user-page-state-impl';
import {
  DEFAULT_PARTICIPANT_INVITE_NEW_USER_FORM_VALUE,
  ParticipantInviteNewUserPageFormModel,
  ParticipantInviteNewUserPageFormValue,
} from './participant-invite-new-user-page-form-model';

@Component({
  selector: 'app-participant-invite-new-user',
  templateUrl: './participant-invite-new-user.component.html',
})
export class ParticipantInviteNewUserComponent implements OnInit, OnDestroy {
  state = DEFAULT_PARTICIPANT_INVITE_NEW_USER_PAGE_STATE;
  group = this.buildFormGroup();

  existingUserRoles: UserRoleDto[] = [];

  private ngOnDestroy$ = new Subject();

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private store: Store,
    private formBuilder: FormBuilder,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  get loading(): boolean {
    return this.state.state === 'submitting';
  }

  ngOnInit(): void {
    this.startListeningToState();
    this.globalStateUtils.userRoles$.subscribe((userRoles) => {
      this.existingUserRoles = [...userRoles];
    });
  }

  buildFormGroup(): FormGroup<ParticipantInviteNewUserPageFormModel> {
    const initial = DEFAULT_PARTICIPANT_INVITE_NEW_USER_FORM_VALUE;
    return this.formBuilder.nonNullable.group({
      firstName: [initial.firstName, [Validators.required]],
      lastName: [initial.lastName, [Validators.required]],
      email: [initial.email, [Validators.required]],
      role: [initial.role, [Validators.required]],
    });
  }

  private startListeningToState() {
    this.store
      .select<ParticipantInviteNewUserPageState>(
        ParticipantInviteNewUserPageStateImpl,
      )
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
      });
  }

  submit(): void {
    let formValue: ParticipantInviteNewUserPageFormValue = this.value;
    let request: InviteParticipantUserRequest = {
      firstName: formValue.firstName!,
      lastName: formValue.lastName!,
      email: formValue.email!,
      role: formValue.role!,
    };

    this.group.disable();
    this.store.dispatch(
      new InviteNewUser(
        request,
        () => this.group.enable(),
        () => this.group.disable(),
      ),
    );
  }

  get value(): ParticipantInviteNewUserPageFormValue {
    return this.group.value as ParticipantInviteNewUserPageFormValue;
  }

  getAllowedUserRoles(): UserRoleDto[] {
    return Object.values(UserRoleDto).filter((it) =>
      it.startsWith('PARTICIPANT'),
    );
  }

  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
