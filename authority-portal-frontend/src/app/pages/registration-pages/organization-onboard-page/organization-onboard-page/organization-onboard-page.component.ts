import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatStepper} from '@angular/material/stepper';
import {Subject, take, takeUntil} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {Store} from '@ngxs/store';
import {
  OwnOrganizationDetailsDto,
  UserDetailDto,
  UserInfo,
} from '@sovity.de/authority-portal-client';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {phoneNumberValidator} from 'src/app/core/utils/validators/phone-number-validator';
import {
  mergeFormGroups,
  switchDisabledControls,
} from '../../../../core/utils/form-utils';
import {buildOrganizationProfileForm} from '../../../../shared/components/business/organization-profile-form/organization-profile-form-builder';
import {organizationProfileFormEnabledCtrls} from '../../../../shared/components/business/organization-profile-form/organization-profile-form-enabled-ctrls';
import {OrganizationProfileFormModel} from '../../../../shared/components/business/organization-profile-form/organization-profile-form-model';
import {buildAddressString} from '../../organization-create-page/organization-create-page/address-utils';
import {buildFullName} from '../../organization-create-page/organization-create-page/name-utils';
import {
  OnboardingProcessFormSubmit,
  OnboardingProcessRequest,
  Reset,
} from '../state/organization-onboard-page-action';
import {
  DEFAULT_ORGANIZATION_ONBOARD_PAGE_PAGE_STATE,
  OrganizationOnboardPageState,
} from '../state/organization-onboard-page-state';
import {OrganizationOnboardPageStateImpl} from '../state/organization-onboard-page-state-impl';
import {
  DEFAULT_ONBOARDING_WIZARD_FORM_VALUE,
  OnboardingOrganizationTabFormModel,
  OnboardingOrganizationTabFormValue,
  OnboardingUserTabFormModel,
  OnboardingUserTabFormValue,
  OnboardingWizardFormModel,
} from './organization-onboard-page.model';

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

  get orgForm(): FormGroup<OnboardingOrganizationTabFormModel> {
    return this.parentFormGroup.controls.organizationTab;
  }

  get orgProfileForm(): FormGroup<OrganizationProfileFormModel> {
    // this only requires a cast because A extends B does not imply T<A> extend T<B>
    return this.orgForm as unknown as FormGroup<OrganizationProfileFormModel>;
  }

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private globalStateUtils: GlobalStateUtils,
  ) {}

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
    const initial = DEFAULT_ONBOARDING_WIZARD_FORM_VALUE;
    const initialUser: OnboardingUserTabFormValue = {
      ...initial.userTab,
      firstName: user.firstName,
      lastName: user.lastName,
      jobTitle: user.position,
      phoneNumber: user.phone,
      acceptedTos:
        this.state.onboardingType === 'USER_ONBOARDING'
          ? initial.userTab.acceptedTos
          : true,
    };

    const initialOrganization: OnboardingOrganizationTabFormValue = {
      ...initial.organizationTab,
      legalName: organizationDetail.name,
    };

    let userTab: FormGroup<OnboardingUserTabFormModel> =
      this.formBuilder.nonNullable.group({
        firstName: [initialUser.firstName, [Validators.required]],
        lastName: [initialUser.lastName, [Validators.required]],
        jobTitle: [initialUser.jobTitle, [Validators.required]],
        phoneNumber: [
          initialUser.phoneNumber,
          [Validators.required, phoneNumberValidator],
        ],
        acceptedTos: [initialUser.acceptedTos, Validators.requiredTrue],
      });

    let organizationTab: FormGroup<OnboardingOrganizationTabFormModel> =
      mergeFormGroups(
        buildOrganizationProfileForm(this.formBuilder, initialOrganization),
        this.formBuilder.nonNullable.group({
          acceptedTos: [
            initialOrganization.acceptedTos,
            Validators.requiredTrue,
          ],
        }),
      );

    switchDisabledControls<OnboardingOrganizationTabFormValue>(
      organizationTab,
      (value: OnboardingOrganizationTabFormValue) => {
        return {
          ...organizationProfileFormEnabledCtrls(value),
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

  submit(): void {
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

    let techContactName: string;
    let techContactEmail: string;
    let techContactPhone: string;
    if (org?.technicalContactSameAsMain) {
      techContactName = mainContactName;
      techContactEmail = mainContactEmail;
      techContactPhone = mainContactPhone;
    } else {
      techContactName = buildFullName(
        org?.technicalContactFirstName,
        org?.technicalContactLastName,
      );
      techContactEmail = org?.technicalContactEmail || '';
      techContactPhone = org?.technicalContactPhoneNumber || '';
    }

    let request: OnboardingProcessRequest = {
      userProfile: {
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        jobTitle: user?.jobTitle || '',
        phoneNumber: user?.phoneNumber || '',
      },
      organizationProfile: {
        name: org?.legalName || '',

        // Organization Metadata
        url: org?.website || '',
        description: org?.description || '',
        businessUnit: org?.businessUnit || '',
        address: mainAddress,
        billingAddress: billingAddress,
        legalIdType: org?.legalIdType || 'TAX_ID',
        legalIdNumber: org?.legalId || '',
        commerceRegisterLocation: org?.commerceRegisterLocation || '',

        // Organization Contacts
        mainContactName,
        mainContactEmail,
        mainContactPhone,
        techContactName,
        techContactEmail,
        techContactPhone,
      },
    };
    this.store.dispatch(
      new OnboardingProcessFormSubmit(
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
}
