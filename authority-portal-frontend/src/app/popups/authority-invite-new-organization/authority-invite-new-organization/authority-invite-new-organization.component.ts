/*
 * Copyright (c) 2024 sovity GmbH
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Contributors:
 *      sovity GmbH - initial implementation
 */

import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {InviteOrganizationRequest} from '@sovity.de/authority-portal-client';
import {phoneNumberValidator} from 'src/app/core/utils/validators/phone-number-validator';
import {InviteNewOrganization} from '../state/authority-invite-new-organization-page-actions';
import {
  AuthorityInviteNewOrganizationPageState,
  DEFAULT_AUTHORITY_INVITE_NEW_ORGANIZATION_PAGE_STATE,
} from '../state/authority-invite-new-organization-page-state';
import {AuthorityInviteNewOrganizationPageStateImpl} from '../state/authority-invite-new-organization-page-state-impl';
import {
  AuthorityInviteNewOrganizationPageFormModel,
  AuthorityInviteNewOrganizationPageFormValue,
  DEFAULT_AUTHORITY_INVITE_NEW_ORGANIZATION_FORM_VALUE,
} from './authority-invite-new-organization.model';

@Component({
  selector: 'app-authority-invite-new-organization',
  templateUrl: './authority-invite-new-organization.component.html',
})
export class AuthorityInviteNewOrganizationComponent {
  state = DEFAULT_AUTHORITY_INVITE_NEW_ORGANIZATION_PAGE_STATE;
  group = this.buildFormGroup();

  ngOnDestroy$ = new Subject();

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AuthorityInviteNewOrganizationComponent>,
  ) {}

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
      userJobTitle: [initial.userJobTitle],
      userPhoneNumber: [initial.userPhoneNumber, [phoneNumberValidator]],
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
      userFirstName: formValue.userFirstName,
      userLastName: formValue.userLastName,
      userEmail: formValue.userEmail,
      orgName: formValue.orgName,
      userJobTitle: formValue.userJobTitle,
      userPhoneNumber: formValue.userPhoneNumber,
    };
    this.store.dispatch(
      new InviteNewOrganization(
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
