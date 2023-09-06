import {Injectable} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {
  OrganizationCreateForm,
  OrganizationCreateFormValue,
} from './organization-create-form';

@Injectable()
export class OrganizationCreateFormImpl {
  form = this.buildForm();

  private buildForm(): FormGroup<OrganizationCreateForm> {
    return new FormGroup<OrganizationCreateForm>({
      companyName: new FormControl('', {
        validators: Validators.required,
        nonNullable: true,
      }),
      address: new FormControl('', {
        validators: Validators.required,
        nonNullable: true,
      }),
      duns: new FormControl('', {
        validators: Validators.required,
        nonNullable: true,
      }),
      url: new FormControl('', {
        validators: Validators.required,
        nonNullable: true,
      }),
      securityEmail: new FormControl('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
      authorizedCheck: new FormControl(false, {
        validators: Validators.requiredTrue,
        nonNullable: true,
      }),
    });
  }

  getValue(): OrganizationCreateFormValue {
    return this.form.value;
  }
}
