import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {InviteParticipantUserRequest} from '@sovity.de/authority-portal-client';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {
  getAvailableApplicationRoles,
  mapRolesToReadableFormat,
} from 'src/app/core/utils/user-role-utils';
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
} from './participant-invite-new-user.model';

@Component({
  selector: 'app-participant-invite-new-user',
  templateUrl: './participant-invite-new-user.component.html',
})
export class ParticipantInviteNewUserComponent {
  state = DEFAULT_PARTICIPANT_INVITE_NEW_USER_PAGE_STATE;
  group = this.buildFormGroup();
  assignableRoles: string[] = [];

  ngOnDestroy$ = new Subject();

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ParticipantInviteNewUserComponent>,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  get value(): ParticipantInviteNewUserPageFormValue {
    return this.group.value as ParticipantInviteNewUserPageFormValue;
  }

  ngOnInit(): void {
    this.startListeningToState();
    this.getAssignableRoles();
  }

  buildFormGroup(): FormGroup<ParticipantInviteNewUserPageFormModel> {
    const initial = DEFAULT_PARTICIPANT_INVITE_NEW_USER_FORM_VALUE;
    return this.formBuilder.nonNullable.group({
      firstName: [initial.firstName, [Validators.required]],
      lastName: [initial.lastName, [Validators.required]],
      email: [initial.email, [Validators.required, Validators.email]],
      role: [initial.role, [Validators.required]],
    });
  }

  getAssignableRoles() {
    this.globalStateUtils.userInfo$.subscribe((userInfo) => {
      this.assignableRoles = getAvailableApplicationRoles(
        Array.from(userInfo.roles),
      );
    });
  }

  startListeningToState() {
    this.store
      .select<ParticipantInviteNewUserPageState>(
        ParticipantInviteNewUserPageStateImpl,
      )
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
      });
  }

  mapToReadable(role: string): string {
    return mapRolesToReadableFormat(role);
  }

  submit(): void {
    let formValue: ParticipantInviteNewUserPageFormValue = this.value;
    let request: InviteParticipantUserRequest = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      role: formValue.role,
    };
    this.store.dispatch(
      new InviteNewUser(
        request,
        () => this.group.enable(),
        () => this.group.disable(),
      ),
    );
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
