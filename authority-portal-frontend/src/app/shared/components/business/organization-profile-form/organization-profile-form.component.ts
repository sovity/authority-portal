import {Component, Input, OnDestroy} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {OrganizationProfileFormModel} from './organization-profile-form-model';

@Component({
  selector: 'app-organization-profile-form',
  templateUrl: './organization-profile-form.component.html',
})
export class OrganizationProfileFormComponent implements OnDestroy {
  @Input()
  orgForm!: FormGroup<OrganizationProfileFormModel>;

  idTypes = [
    {value: 'TAX_ID', viewValue: 'Tax ID'},
    {
      value: 'COMMERCE_REGISTER_INFO',
      viewValue: 'Commercial Register Number',
    },
  ];

  ngOnDestroy$ = new Subject();

  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
