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
import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatStepper} from '@angular/material/stepper';
import {Subject, take, takeUntil} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {Store} from '@ngxs/store';
import {
  OwnOrganizationDetailsDto,
  UserDetailDto,
} from '@sovity.de/authority-portal-client';
import {
  mergeFormGroups,
  switchDisabledControls,
} from '../../../../core/utils/form-utils';
import {buildOrganizationCreateForm} from '../../../../shared/components/business/organization-create-form/organization-create-form-builder';
import {organizationCreateFormEnabledCtrls} from '../../../../shared/components/business/organization-create-form/organization-create-form-enabled-ctrls';
import {OrganizationCreateFormModel} from '../../../../shared/components/business/organization-create-form/organization-create-form-model';
import {buildUserOnboardForm} from '../../../../shared/components/business/user-onboard-form/user-onboard-form-builder';
import {UserOnboardFormModel} from '../../../../shared/components/business/user-onboard-form/user-onboard-form-model';
import {
  OnboardingProcessFormSubmit,
  Reset,
} from '../state/organization-onboard-page-action';
import {
  DEFAULT_ORGANIZATION_ONBOARD_PAGE_PAGE_STATE,
  OrganizationOnboardPageState,
} from '../state/organization-onboard-page-state';
import {OrganizationOnboardPageStateImpl} from '../state/organization-onboard-page-state-impl';
import {
  buildInitialOnboardingFormValue,
  buildOnboardingRequest,
} from './organization-onboard-page.form-mapper';
import {
  OnboardingOrganizationTabFormModel,
  OnboardingOrganizationTabFormValue,
  OnboardingUserTabFormModel,
  OnboardingWizardFormModel,
  OnboardingWizardFormValue,
} from './organization-onboard-page.form-model';

@Component({
  selector: 'app-organization-onboard-page',
  templateUrl: './organization-onboard-page.component.html',
})
export class OrganizationOnboardPageComponent implements OnInit {
  state = DEFAULT_ORGANIZATION_ONBOARD_PAGE_PAGE_STATE;
  parentFormGroup!: FormGroup<OnboardingWizardFormModel>;
  showForm: boolean = false;
  ngOnDestroy$ = new Subject();

  @ViewChild('stepper') stepper!: MatStepper;

  get userForm(): FormGroup<OnboardingUserTabFormModel> {
    return this.parentFormGroup.controls.userTab;
  }
  get userOnboardForm(): FormGroup<UserOnboardFormModel> {
    return this.parentFormGroup.controls
      .userTab as unknown as FormGroup<UserOnboardFormModel>;
  }

  get orgForm(): FormGroup<OnboardingOrganizationTabFormModel> {
    return this.parentFormGroup.controls.organizationTab;
  }

  get orgProfileForm(): FormGroup<OrganizationCreateFormModel> {
    // this only requires a cast because A extends B does not imply T<A> extend T<B>
    return this.orgForm as unknown as FormGroup<OrganizationCreateFormModel>;
  }

  constructor(private store: Store, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.store.dispatch(Reset);
    this.startListeningToState();
    this.setupFormOnce();
  }

  private setupFormOnce() {
    this.store
      .select<OrganizationOnboardPageState>(OrganizationOnboardPageStateImpl)
      .pipe(
        map((it) => it.details),
        filter((it) => it.isReady),
        map((it) => it.data),
        takeUntil(this.ngOnDestroy$),
        take(1),
      )
      .subscribe((details) => {
        this.parentFormGroup = this.buildFormGroup(
          details.user,
          details.organization,
        );
      });
  }

  private startListeningToState() {
    this.store
      .select<OrganizationOnboardPageState>(OrganizationOnboardPageStateImpl)
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
      });
  }

  buildFormGroup(
    user: UserDetailDto,
    organizationDetail: OwnOrganizationDetailsDto,
  ): FormGroup<OnboardingWizardFormModel> {
    const initial = buildInitialOnboardingFormValue(user, organizationDetail);
    let userTab: FormGroup<OnboardingUserTabFormModel> = mergeFormGroups(
      buildUserOnboardForm(this.formBuilder, initial.userTab),
      this.formBuilder.nonNullable.group({
        acceptedTos: [initial.userTab.acceptedTos, Validators.requiredTrue],
      }),
    );

    let organizationTab: FormGroup<OnboardingOrganizationTabFormModel> =
      mergeFormGroups(
        buildOrganizationCreateForm(this.formBuilder, initial.organizationTab),
        this.formBuilder.nonNullable.group({
          acceptedTos: [
            initial.organizationTab.acceptedTos,
            Validators.requiredTrue,
          ],
        }),
      );

    switchDisabledControls<OnboardingOrganizationTabFormValue>(
      organizationTab,
      (value: OnboardingOrganizationTabFormValue) => {
        return {
          ...organizationCreateFormEnabledCtrls(value),
          acceptedTos: true,
        };
      },
    );

    return this.formBuilder.nonNullable.group({
      isEditable: [true, Validators.requiredTrue],
      submitted: [false, Validators.requiredTrue],
      userTab,
      organizationTab,
    });
  }

  submit(): void {
    const request = buildOnboardingRequest(
      this.parentFormGroup.value as OnboardingWizardFormValue,
    );
    this.store.dispatch(
      new OnboardingProcessFormSubmit(
        request,
        () => this.parentFormGroup.enable(),
        () => this.parentFormGroup.disable(),
        () => {
          this.parentFormGroup.controls.submitted.setValue(true);
          this.parentFormGroup.controls.isEditable.setValue(false);
          setTimeout(() => {
            this.stepper.next();
          }, 0);
        },
      ),
    );
  }
}
