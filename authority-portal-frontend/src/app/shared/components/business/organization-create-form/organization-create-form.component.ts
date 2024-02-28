import {Component, Input, OnDestroy} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {OrganizationCreateFormModel} from './organization-create-form-model';

export const LEGAL_ID_TYPES: {value: string; viewValue: string}[] = [
  {value: 'TAX_ID', viewValue: 'Tax ID'},
  {
    value: 'COMMERCE_REGISTER_INFO',
    viewValue: 'Commercial Register Number',
  },
];

@Component({
  selector: 'app-organization-create-form',
  templateUrl: './organization-create-form.component.html',
})
export class OrganizationCreateFormComponent implements OnDestroy {
  @Input()
  orgForm!: FormGroup<OrganizationCreateFormModel>;

  idTypes = LEGAL_ID_TYPES;

  ngOnDestroy$ = new Subject();

  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
