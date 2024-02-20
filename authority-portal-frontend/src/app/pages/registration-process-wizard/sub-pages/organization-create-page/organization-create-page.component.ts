import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatStepper} from '@angular/material/stepper';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {
  OrganizationLegalIdTypeDto,
  RegistrationRequestDto,
} from '@sovity.de/authority-portal-client';
import {APP_CONFIG, AppConfig} from '../../../../core/config/app-config';
import {passwordEntropyValidator} from '../../../../core/utils/validators/password-entropy-validator';
import {passwordMatchValidator} from '../../../../core/utils/validators/password-match-validator';
import {phoneNumberValidator} from '../../../../core/utils/validators/phone-number-validator';
import {urlValidator} from '../../../../core/utils/validators/url-validator';
import {zipcodeValidator} from '../../../../core/utils/validators/zipcode-validator';
import {
  DEFAULT_ORGANIZATION_PROFILE_CREATE_FORM_VALUE,
  DEFAULT_ORGANIZATION_REGISTRATION_PAGE_FORM_VALUE,
  DEFAULT_USER_PROFILE_CREATE_FORM_VALUE,
  OrganizationRegistrationPageParentFormModel,
} from './organization-create-page-form-model';
import {CreateOrganization} from './state/organization-create-page-action';
import {
  DEFAULT_ORGANIZATION_REGISTRATION_PAGE_STATE,
  OrganizationRegistrationPageState,
} from './state/organization-create-page-state';
import {OrganizationCreatePageStateImpl} from './state/organization-create-page-state-impl';

@Component({
  selector: 'app-organization-create',
  templateUrl: './organization-create-page.component.html',
})
export class OrganizationCreatePageComponent implements OnInit, OnDestroy {
  state = DEFAULT_ORGANIZATION_REGISTRATION_PAGE_STATE;
  parentFormGroup!: FormGroup<OrganizationRegistrationPageParentFormModel>;

  @ViewChild('stepper') stepper!: MatStepper;

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private store: Store,
    private formBuilder: FormBuilder,
  ) {}

  get loading(): boolean {
    return this.state.state === 'submitting';
  }

  ngOnInit(): void {
    this.parentFormGroup = this.buildFormGroup();
    this.parentFormGroup.controls.userProfile.setValidators([
      passwordMatchValidator('password', 'confirmPassword'),
    ]);
    this.parentFormGroup.controls.userProfile.updateValueAndValidity();
    this.startListeningToState();
  }

  buildFormGroup(): FormGroup<OrganizationRegistrationPageParentFormModel> {
    const initialUserProfile = DEFAULT_USER_PROFILE_CREATE_FORM_VALUE;
    const initialOrganizationProfile =
      DEFAULT_ORGANIZATION_PROFILE_CREATE_FORM_VALUE;
    const initialMainContactProfile = DEFAULT_USER_PROFILE_CREATE_FORM_VALUE;
    const initialTechnicalContactProfile =
      DEFAULT_USER_PROFILE_CREATE_FORM_VALUE;
    const initialFormValues = DEFAULT_ORGANIZATION_REGISTRATION_PAGE_FORM_VALUE;

    const organizationRegistrationForm: FormGroup<OrganizationRegistrationPageParentFormModel> =
      this.formBuilder.nonNullable.group({
        userProfile: this.formBuilder.nonNullable.group({
          firstName: [initialUserProfile.firstName, [Validators.required]],
          lastName: [initialUserProfile.lastName, [Validators.required]],
          jobTitle: [initialUserProfile.jobTitle, [Validators.required]],
          phoneNumber: [
            initialUserProfile.phoneNumber,
            [Validators.required, phoneNumberValidator],
          ],
          email: [
            initialUserProfile.email,
            [Validators.required, Validators.email],
          ],
          password: [
            initialUserProfile.password,
            [
              Validators.required,
              Validators.minLength(8),
              passwordEntropyValidator,
            ],
          ],
          confirmPassword: [initialUserProfile.password, [Validators.required]],
        }),
        organizationProfile: this.formBuilder.nonNullable.group({
          legalName: [
            initialOrganizationProfile.legalName,
            [Validators.required],
          ],
          website: [
            initialOrganizationProfile.website,
            [Validators.required, urlValidator],
          ],
          businessUnit: [
            initialOrganizationProfile.businessUnit,
            [Validators.required],
          ],
          address: this.formBuilder.nonNullable.group({
            street: [
              initialOrganizationProfile.address.street,
              [Validators.required],
            ],
            city: [
              initialOrganizationProfile.address.city,
              [Validators.required],
            ],
            houseNo: [
              initialOrganizationProfile.address.houseNo,
              [Validators.required],
            ],
            zipCode: [
              initialOrganizationProfile.address.zipCode,
              [Validators.required, zipcodeValidator],
            ],
            country: [
              initialOrganizationProfile.address.country,
              [Validators.required],
            ],
          }),
          billingAddress: this.formBuilder.nonNullable.group({
            street: [
              initialOrganizationProfile.address.street,
              [Validators.required],
            ],
            city: [
              initialOrganizationProfile.address.city,
              [Validators.required],
            ],
            houseNo: [
              initialOrganizationProfile.address.houseNo,
              [Validators.required],
            ],
            zipCode: [
              initialOrganizationProfile.address.zipCode,
              [Validators.required, zipcodeValidator],
            ],
            country: [
              initialOrganizationProfile.address.country,
              [Validators.required],
            ],
          }),
          description: [
            initialOrganizationProfile.description,
            [Validators.required],
          ],
          legalIdType: [
            initialOrganizationProfile.legalIdType,
            [Validators.required],
          ],
          legalId: [initialOrganizationProfile.legalId, [Validators.required]],
          commerceRegisterLocation: [
            initialOrganizationProfile.commerceRegisterLocation,
          ],
        }),
        mainContactProfile: this.formBuilder.nonNullable.group({
          firstName: [
            initialMainContactProfile.firstName,
            [Validators.required],
          ],
          lastName: [initialMainContactProfile.lastName, [Validators.required]],
          phoneNumber: [
            initialMainContactProfile.phoneNumber,
            [Validators.required, phoneNumberValidator],
          ],
          email: [initialMainContactProfile.email, [Validators.required]],
        }),
        technicalContactProfile: this.formBuilder.nonNullable.group({
          firstName: [
            initialTechnicalContactProfile.firstName,
            [Validators.required],
          ],
          lastName: [
            initialTechnicalContactProfile.lastName,
            [Validators.required],
          ],
          phoneNumber: [
            initialTechnicalContactProfile.phoneNumber,
            [Validators.required, phoneNumberValidator],
          ],
          email: [initialTechnicalContactProfile.email, [Validators.required]],
        }),
        acceptedConditions: [
          initialFormValues.acceptedConditions,
          Validators.requiredTrue,
        ],
      });
    return organizationRegistrationForm;
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
    let userProfile = this.parentFormGroup.value.userProfile;
    let organizationProfile = this.parentFormGroup.value.organizationProfile;
    let mainContactProfile = this.parentFormGroup.value.mainContactProfile;
    let technicalContactProfile =
      this.parentFormGroup.value.technicalContactProfile;
    let request: RegistrationRequestDto = {
      userEmail: userProfile?.email || '',
      userFirstName: userProfile?.firstName || '',
      userLastName: userProfile?.lastName || '',
      userJobTitle: userProfile?.jobTitle || '',
      userPhone: userProfile?.phoneNumber || '',
      userPassword: userProfile?.password || '',
      organizationName: organizationProfile?.legalName || '',
      organizationUrl: organizationProfile?.website || '',
      organizationBusinessUnit: organizationProfile?.businessUnit || '',
      organizationAddress: organizationProfile?.address?.street || '',
      organizationBillingAddress:
        organizationProfile?.billingAddress?.street || '',
      organizationLegalIdNumber: organizationProfile?.legalId || '',
      organizationLegalIdType:
        organizationProfile?.legalIdType || OrganizationLegalIdTypeDto.TaxId,
      organizationCommerceRegisterLocation: '',
      organizationMainContactName:
        mainContactProfile?.firstName ||
        '' + mainContactProfile?.lastName ||
        '',
      organizationMainContactEmail: mainContactProfile?.email || '',
      organizationMainContactPhone: mainContactProfile?.phoneNumber || '',
      organizationTechContactName:
        technicalContactProfile?.firstName ||
        '' + technicalContactProfile?.lastName ||
        '',
      organizationTechContactEmail: technicalContactProfile?.email || '',
      organizationTechContactPhone: technicalContactProfile?.phoneNumber || '',
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
