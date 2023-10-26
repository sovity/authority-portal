import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {InviteOrganizationRequest} from '@sovity.de/authority-portal-client';
import {
  AuthorityInviteNewOrganizationPageFormModel,
  AuthorityInviteNewOrganizationPageFormValue,
  DEFAULT_AUTHORITY_INVITE_NEW_ORGANIZATION_FORM_VALUE,
} from 'src/app/pages/authority-invite-new-organization/authority-invite-new-organization/authority-invite-new-organization.model';
import {InviteNewOrganization} from 'src/app/pages/authority-invite-new-organization/state/authority-invite-new-organization-page-actions';
import {
  AuthorityInviteNewOrganizationPageState,
  DEFAULT_AUTHORITY_INVITE_NEW_ORGANIZATION_PAGE_STATE,
} from 'src/app/pages/authority-invite-new-organization/state/authority-invite-new-organization-page-state';
import {AuthorityInviteNewOrganizationPageStateImpl} from 'src/app/pages/authority-invite-new-organization/state/authority-invite-new-organization-page-state-impl';

@Component({
  selector: 'app-authority-invite-new-organization',
  templateUrl: './authority-invite-new-organization.component.html',
})
export class AuthorityInviteNewOrganizationComponent {
  state = DEFAULT_AUTHORITY_INVITE_NEW_ORGANIZATION_PAGE_STATE;
  group = this.buildFormGroup();

  ngOnDestroy$ = new Subject();

  constructor(private store: Store, private formBuilder: FormBuilder) {}

  get loading(): boolean {
    return this.state.state === 'submitting';
  }

  get value(): AuthorityInviteNewOrganizationPageFormValue {
    return this.group.value as AuthorityInviteNewOrganizationPageFormValue;
  }

  ngOnInit(): void {
    this.startListeningToState();
  }

  buildFormGroup(): FormGroup<AuthorityInviteNewOrganizationPageFormModel> {
    const initial = DEFAULT_AUTHORITY_INVITE_NEW_ORGANIZATION_FORM_VALUE;
    return this.formBuilder.nonNullable.group({
      userFirstName: [initial.userFirstName, [Validators.required]],
      userLastName: [initial.userLastName, [Validators.required]],
      userEmail: [initial.userEmail, [Validators.required, Validators.email]],
      orgName: [initial.orgName, [Validators.required]],
      orgAddress: [initial.orgAddress, [Validators.required]],
      orgDuns: [initial.orgDuns, [Validators.required]],
      orgUrl: [initial.orgUrl, [Validators.required]],
      orgSecurityEmail: [
        initial.orgSecurityEmail,
        [Validators.required, Validators.email],
      ],
    });
  }

  startListeningToState() {
    this.store
      .select<AuthorityInviteNewOrganizationPageState>(
        AuthorityInviteNewOrganizationPageStateImpl,
      )
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
      });
  }

  submit(): void {
    let formValue: AuthorityInviteNewOrganizationPageFormValue = this.value;
    let request: InviteOrganizationRequest = {
      userFirstName: formValue.userFirstName!,
      userLastName: formValue.userLastName!,
      userEmail: formValue.userEmail!,
      orgName: formValue.orgName!,
      orgAddress: formValue.orgAddress!,
      orgDuns: formValue.orgDuns!,
      orgUrl: formValue.orgUrl!,
      orgSecurityEmail: formValue.orgSecurityEmail!,
    };

    this.store.dispatch(
      new InviteNewOrganization(
        request,
        () => this.group.enable(),
        () => this.group.disable(),
      ),
    );
  }

  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
