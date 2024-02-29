import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatStepper} from '@angular/material/stepper';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {APP_CONFIG, AppConfig} from '../../../../core/config/app-config';
import {
  mergeFormGroups,
  switchDisabledControls,
} from '../../../../core/utils/form-utils';
import {buildOrganizationCreateForm} from '../../../../shared/components/business/organization-create-form/organization-create-form-builder';
import {organizationCreateFormEnabledCtrls} from '../../../../shared/components/business/organization-create-form/organization-create-form-enabled-ctrls';
import {OrganizationCreateFormModel} from '../../../../shared/components/business/organization-create-form/organization-create-form-model';
import {buildUserCreateForm} from '../../../../shared/components/business/user-create-form/user-create-form-builder';
import {CreateOrganization} from '../state/organization-create-page-action';
import {
  DEFAULT_ORGANIZATION_REGISTRATION_PAGE_STATE,
  OrganizationRegistrationPageState,
} from '../state/organization-create-page-state';
import {OrganizationCreatePageStateImpl} from '../state/organization-create-page-state-impl';
import {buildRegistrationRequest} from './organization-create-page.form-mapper';
import {
  DEFAULT_REGISTRATION_WIZARD_FORM_VALUE,
  RegistrationOrganizationTabFormModel,
  RegistrationOrganizationTabFormValue,
  RegistrationUserTabFormModel,
  RegistrationWizardFormModel,
  RegistrationWizardFormValue,
} from './organization-create-page.form-model';

@Component({
  selector: 'app-organization-create',
  templateUrl: './organization-create-page.component.html',
})
export class OrganizationCreatePageComponent implements OnInit, OnDestroy {
  state = DEFAULT_ORGANIZATION_REGISTRATION_PAGE_STATE;
  parentFormGroup!: FormGroup<RegistrationWizardFormModel>;

  @ViewChild('stepper') stepper!: MatStepper;

  get loading(): boolean {
    return this.state.state === 'submitting';
  }

  get userForm(): FormGroup<RegistrationUserTabFormModel> {
    return this.parentFormGroup.controls.userTab;
  }

  get orgForm(): FormGroup<RegistrationOrganizationTabFormModel> {
    return this.parentFormGroup.controls.organizationTab;
  }

  get orgProfileForm(): FormGroup<OrganizationCreateFormModel> {
    // this only requires a cast because A extends B does not imply T<A> extend T<B>
    return this.orgForm as unknown as FormGroup<OrganizationCreateFormModel>;
  }

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private store: Store,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.parentFormGroup = this.buildFormGroup();
    this.startListeningToState();
  }

  buildFormGroup(): FormGroup<RegistrationWizardFormModel> {
    const initial = DEFAULT_REGISTRATION_WIZARD_FORM_VALUE;
    const initialUser = initial.userTab;
    const initialOrganization = initial.organizationTab;

    const userTab = buildUserCreateForm(this.formBuilder, initialUser);

    const organizationTab: FormGroup<RegistrationOrganizationTabFormModel> =
      mergeFormGroups(
        buildOrganizationCreateForm(this.formBuilder, initialOrganization),
        this.formBuilder.nonNullable.group({
          acceptedTos: [
            initialOrganization.acceptedTos,
            Validators.requiredTrue,
          ],
        }),
      );

    switchDisabledControls<RegistrationOrganizationTabFormValue>(
      organizationTab,
      (value: RegistrationOrganizationTabFormValue) => {
        return {
          ...organizationCreateFormEnabledCtrls(value),
          acceptedTos: true,
        };
      },
    );

    return this.formBuilder.nonNullable.group({
      isEditable: [true, Validators.requiredTrue],
      userTab,
      organizationTab,
    });
  }

  startListeningToState() {
    this.store
      .select<OrganizationRegistrationPageState>(
        OrganizationCreatePageStateImpl,
      )
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
      });
  }

  submit(): void {
    const request = buildRegistrationRequest(
      this.parentFormGroup.value as RegistrationWizardFormValue,
    );

    this.store.dispatch(
      new CreateOrganization(
        request,
        () => this.parentFormGroup.enable(),
        () => this.parentFormGroup.disable(),
        () => {
          this.stepper.next();
          this.parentFormGroup.controls.isEditable.setValue(false);
        },
      ),
    );
  }

  finish() {
    window.location.replace(this.config.invalidateSessionCookiesUrl);
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
