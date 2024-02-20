import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {UserProfileCreateFormModel} from '../../../../pages/registration-process-wizard/sub-pages/organization-create-page/organization-create-page-form-model';

@Component({
  selector: 'app-user-profile-form',
  templateUrl: './user-profile-form.component.html',
})
export class UserProfileFormComponent {
  @Input() formGroup!: FormGroup<UserProfileCreateFormModel>;

  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
