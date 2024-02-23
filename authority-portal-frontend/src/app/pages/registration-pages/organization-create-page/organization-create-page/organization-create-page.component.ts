import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatStepper} from '@angular/material/stepper';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {RegistrationRequestDto} from '@sovity.de/authority-portal-client';
import {APP_CONFIG, AppConfig} from '../../../../core/config/app-config';
import {
  mergeFormGroups,
  switchDisabledControls,
} from '../../../../core/utils/form-utils';
import {passwordEntropyValidator} from '../../../../core/utils/validators/password-entropy-validator';
import {passwordMatchValidator} from '../../../../core/utils/validators/password-match-validator';
import {phoneNumberValidator} from '../../../../core/utils/validators/phone-number-validator';
import {buildOrganizationProfileForm} from '../../../../shared/components/business/organization-profile-form/organization-profile-form-builder';
import {organizationProfileFormEnabledCtrls} from '../../../../shared/components/business/organization-profile-form/organization-profile-form-enabled-ctrls';
import {OrganizationProfileFormModel} from '../../../../shared/components/business/organization-profile-form/organization-profile-form-model';
import {DEFAULT_ORGANIZATION_ONBOARD_PAGE_PAGE_STATE} from '../../organization-onboard-page/state/organization-onboard-page-state';
import {CreateOrganization} from '../state/organization-create-page-action';
import {
  DEFAULT_ORGANIZATION_REGISTRATION_PAGE_STATE,
  OrganizationRegistrationPageState,
} from '../state/organization-create-page-state';
import {OrganizationCreatePageStateImpl} from '../state/organization-create-page-state-impl';
import {buildAddressString} from './address-utils';
import {buildFullName} from './name-utils';
import {
  DEFAULT_REGISTRATION_WIZARD_FORM_VALUE,
  RegistrationOrganizationTabFormModel,
  RegistrationOrganizationTabFormValue,
  RegistrationUserTabFormModel,
  RegistrationWizardFormModel,
} from './organization-create-page-form-model';

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

  get orgProfileForm(): FormGroup<OrganizationProfileFormModel> {
    // this only requires a cast because A extends B does not imply T<A> extend T<B>
    return this.orgForm as unknown as FormGroup<OrganizationProfileFormModel>;
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

    const userTab = this.formBuilder.nonNullable.group(
      {
        firstName: [initialUser.firstName, [Validators.required]],
        lastName: [initialUser.lastName, [Validators.required]],
        jobTitle: [initialUser.jobTitle, [Validators.required]],
        phoneNumber: [
          initialUser.phoneNumber,
          [Validators.required, phoneNumberValidator],
        ],
        email: [initialUser.email, [Validators.required, Validators.email]],
        password: [
          initialUser.password,
          [
            Validators.required,
            Validators.minLength(8),
            passwordEntropyValidator,
          ],
        ],
        confirmPassword: [initialUser.password, [Validators.required]],
      },
      {validators: passwordMatchValidator('password', 'confirmPassword')},
    );

    const organizationTab: FormGroup<RegistrationOrganizationTabFormModel> =
      mergeFormGroups(
        buildOrganizationProfileForm(this.formBuilder, initialOrganization),
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
          ...organizationProfileFormEnabledCtrls(value),
          acceptedTos: true,
        };
      },
    );

    return this.formBuilder.nonNullable.group({
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

  /**
   * maps the form values to the request dto and dispatches the create organization action
   */
  submit(): void {
    this.stepper.next();
    let user = this.parentFormGroup.value.userTab;
    let org = this.parentFormGroup.value.organizationTab;

    let mainAddress = buildAddressString({
      street: org?.mainAddressStreet,
      houseNo: org?.mainAddressHouseNo,
      zipCode: org?.mainAddressHouseNo,
      city: org?.mainAddressCity,
      country: org?.mainAddressCountry,
    });

    let billingAddress = org?.billingAddressSameAsMain
      ? mainAddress
      : buildAddressString({
          street: org?.billingAddressStreet,
          houseNo: org?.billingAddressHouseNo,
          zipCode: org?.billingAddressHouseNo,
          city: org?.billingAddressCity,
          country: org?.billingAddressCountry,
        });

    let mainContactName = buildFullName(
      org?.mainContactFirstName,
      org?.mainContactLastName,
    );
    let mainContactEmail = org?.mainContactEmail || '';
    let mainContactPhone = org?.mainContactPhoneNumber || '';

    let technicalContactName: string;
    let technicalContactEmail: string;
    let technicalContactPhone: string;
    if (org?.technicalContactSameAsMain) {
      technicalContactName = mainContactName;
      technicalContactEmail = mainContactEmail;
      technicalContactPhone = mainContactPhone;
    } else {
      technicalContactName = buildFullName(
        org?.technicalContactFirstName,
        org?.technicalContactLastName,
      );
      technicalContactEmail = org?.technicalContactEmail || '';
      technicalContactPhone = org?.technicalContactPhoneNumber || '';
    }

    let request: RegistrationRequestDto = {
      // User Profile
      userEmail: user?.email || '',
      userFirstName: user?.firstName || '',
      userLastName: user?.lastName || '',
      userJobTitle: user?.jobTitle || '',
      userPhone: user?.phoneNumber || '',
      userPassword: user?.password || '',

      // Organization
      organizationName: org?.legalName || '',

      // Organization Metadata
      organizationUrl: org?.website || '',
      organizationDescription: org?.description || '',
      organizationBusinessUnit: org?.businessUnit || '',
      organizationAddress: mainAddress,
      organizationBillingAddress: billingAddress,
      organizationLegalIdType: org?.legalIdType!,
      organizationLegalIdNumber: org?.legalId || '',
      organizationCommerceRegisterLocation: org?.commerceRegisterLocation || '',

      // Organization Contacts
      organizationMainContactName: mainContactName,
      organizationMainContactEmail: mainContactEmail,
      organizationMainContactPhone: mainContactPhone,
      organizationTechContactName: technicalContactName,
      organizationTechContactEmail: technicalContactEmail,
      organizationTechContactPhone: technicalContactPhone,
    };

    this.store.dispatch(
      new CreateOrganization(
        request,
        () => this.parentFormGroup.enable(),
        () => this.parentFormGroup.disable(),
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
