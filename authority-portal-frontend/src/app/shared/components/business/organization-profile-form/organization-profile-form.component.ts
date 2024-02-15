import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {
  AddressCreateFormValue,
  OrganizationProfileCreateFormModel,
} from '../../../../pages/registration-process-wizard/sub-pages/organization-create-page/organization-create-page-form-model';

@Component({
  selector: 'app-organization-profile-form',
  templateUrl: './organization-profile-form.component.html',
})
export class OrganizationProfileFormComponent implements OnInit, OnDestroy {
  @Input() formGroup!: FormGroup<OrganizationProfileCreateFormModel>;

  billingAddressForm!: FormControl;
  showBillingAddress: boolean = false;

  idTypes = [
    {value: 'TAX_ID', viewValue: 'Tax ID'},
    {
      value: 'COMMERCE_REGISTER_INFO',
      viewValue: 'Commercial Register Number',
    },
  ];

  constructor() {
    this.billingAddressForm = new FormControl(this.showBillingAddress);
  }

  ngOnInit(): void {
    this.manageBillingAddress(this.showBillingAddress);
    this.billingAddressForm.valueChanges
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((value) => this.manageBillingAddress(value));
  }

  manageBillingAddress(showBillingAddress: boolean) {
    this.showBillingAddress = showBillingAddress;
    if (!showBillingAddress) {
      this.formGroup
        .get('address')
        ?.statusChanges.pipe(takeUntil(this.ngOnDestroy$))
        .subscribe((status) => {
          if (status) {
            this.formGroup
              .get('billingAddress')
              ?.setValue(
                this.formGroup.controls.address
                  ?.value as AddressCreateFormValue,
              );
          }
        });
    } else {
      this.formGroup.get('billingAddress')?.reset();
    }
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
