import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatStepper} from '@angular/material/stepper';
import {Subject, combineLatest, take, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {
  OwnOrganizationDetailsDto,
  UserInfo,
} from '@sovity.de/authority-portal-client';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {phoneNumberValidator} from 'src/app/core/utils/validators/phone-number-validator';
import {urlValidator} from 'src/app/core/utils/validators/url-validator';
import {zipCodeValidator} from 'src/app/core/utils/validators/zipcode-validator';
import {
  GetOnboardingOrganizationDetails,
  OnboardingProcessFormSubmit,
  OnboardingProcessRequest,
} from '../state/onboarding-process-wizard-page-action';
import {
  DEFAULT_ONBOARDING_PROCESS_WIZARD_PAGE_STATE,
  OnboardingProcessWizardPageState,
} from '../state/onboarding-process-wizard-page-state';
import {OnboardingProcessWizardPageStateImpl} from '../state/onboarding-process-wizard-page-state-impl';
import {
  DEFAULT_CONTACTS_PROFILE_CREATE_FORM_VALUE,
  DEFAULT_ORGANIZATION_PROFILE_ONBOARD_FORM_VALUE,
  DEFAULT_USER_PROFILE_ONBOARD_FORM_VALUE,
  OrganizationRegistrationPageParentFormModel,
} from './onboarding-process-wizard.model';

@Component({
  selector: 'app-onboarding-process-wizard',
  templateUrl: './onboarding-process-wizard.component.html',
})
export class OnboardingProcessWizardComponent implements OnInit {
  state = DEFAULT_ONBOARDING_PROCESS_WIZARD_PAGE_STATE;
  onboardingType!: 'USER_ONBOARDING' | 'USER_ORGANIZATION_ONBOARDING';
  parentFormGroup!: FormGroup<OrganizationRegistrationPageParentFormModel>;
  showForm: boolean = false;
  ngOnDestroy$ = new Subject();

  @ViewChild('stepper') stepper!: MatStepper;

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(GetOnboardingOrganizationDetails);
    this.startListeningToState();
  }

  private startListeningToState() {
    combineLatest({
      state: this.store
        .select<OnboardingProcessWizardPageState>(
          OnboardingProcessWizardPageStateImpl,
        )
        .pipe(takeUntil(this.ngOnDestroy$)),
      userInfo: this.globalStateUtils.userInfo$.pipe(take(1)),
    }).subscribe(({state, userInfo}) => {
      this.state = state;
      if (state.organization.isReady) {
        this.parentFormGroup = this.buildFormGroup(
          userInfo,
          state.organization.data,
        );
        if (state.organization.data.registrationStatus === 'ONBOARDING') {
          this.onboardingType = 'USER_ORGANIZATION_ONBOARDING';
        } else {
          this.onboardingType = 'USER_ONBOARDING';
        }
        this.showForm = true;
      }
    });
  }

  buildFormGroup(
    userInfo: UserInfo,
    organizationDetail: OwnOrganizationDetailsDto,
  ): FormGroup<OrganizationRegistrationPageParentFormModel> {
    const initialUserProfile = DEFAULT_USER_PROFILE_ONBOARD_FORM_VALUE;
    const initialOrganizationProfile =
      DEFAULT_ORGANIZATION_PROFILE_ONBOARD_FORM_VALUE;
    const initialMainContactProfile =
      DEFAULT_CONTACTS_PROFILE_CREATE_FORM_VALUE;
    const initialTechnicalContactProfile =
      DEFAULT_CONTACTS_PROFILE_CREATE_FORM_VALUE;

    const organizationRegistrationForm: FormGroup<OrganizationRegistrationPageParentFormModel> =
      this.formBuilder.nonNullable.group({
        userProfile: this.formBuilder.nonNullable.group({
          firstName: [userInfo.firstName, [Validators.required]],
          lastName: [userInfo.lastName, [Validators.required]],
          jobTitle: [initialUserProfile.jobTitle, [Validators.required]],
          phoneNumber: [
            initialUserProfile.phoneNumber,
            [Validators.required, phoneNumberValidator],
          ],
        }),
        organizationProfile: this.formBuilder.nonNullable.group({
          legalName: [organizationDetail.name, [Validators.required]],
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
              [Validators.required, zipCodeValidator],
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
              [Validators.required, zipCodeValidator],
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
            [],
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
          email: [
            initialMainContactProfile.email,
            [Validators.required, Validators.email],
          ],
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
          email: [
            initialTechnicalContactProfile.email,
            [Validators.required, Validators.email],
          ],
        }),
      });
    return organizationRegistrationForm;
  }

  submit(): void {
    let userProfile = this.parentFormGroup.value.userProfile;
    let organizationProfile = this.parentFormGroup.value.organizationProfile;
    let mainContactProfile = this.parentFormGroup.value.mainContactProfile;
    let technicalContactProfile =
      this.parentFormGroup.value.technicalContactProfile;
    let request: OnboardingProcessRequest = {
      userProfile: {
        firstName: userProfile?.firstName || '',
        lastName: userProfile?.lastName || '',
        jobTitle: userProfile?.jobTitle || '',
        phoneNumber: userProfile?.phoneNumber || '',
      },
      organizationProfile: {
        name: organizationProfile?.legalName || '',
        url: organizationProfile?.website || '',
        businessUnit: organizationProfile?.businessUnit || '',
        address: `${organizationProfile?.address?.country}, ${organizationProfile?.address?.city}, ${organizationProfile?.address?.street}, ${organizationProfile?.address?.houseNo}, ${organizationProfile?.address?.zipCode}`,
        billingAddress: `${organizationProfile?.billingAddress?.country}, ${organizationProfile?.billingAddress?.city}, ${organizationProfile?.billingAddress?.street}, ${organizationProfile?.billingAddress?.houseNo}, ${organizationProfile?.address?.zipCode}`,
        legalIdType: organizationProfile?.legalIdType || 'TAX_ID',
        legalIdNumber: organizationProfile?.legalId || '',
        commerceRegisterLocation:
          organizationProfile?.commerceRegisterLocation || '',
        mainContactName: `${mainContactProfile?.firstName} ${mainContactProfile?.lastName}`,
        mainContactEmail: mainContactProfile?.email || '',
        mainContactPhone: mainContactProfile?.phoneNumber || '',
        techContactName: `${technicalContactProfile?.firstName} ${technicalContactProfile?.lastName}`,
        techContactEmail: technicalContactProfile?.email || '',
        techContactPhone: technicalContactProfile?.phoneNumber || '',
      },
    };
    this.store.dispatch(
      new OnboardingProcessFormSubmit(
        this.onboardingType,
        request,
        () => this.parentFormGroup.enable(),
        () => this.parentFormGroup.disable(),
      ),
    );
    this.stepper.next();
  }
}
