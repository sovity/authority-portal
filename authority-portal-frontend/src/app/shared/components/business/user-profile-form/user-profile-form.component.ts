import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {RegistrationUserTabFormModel} from '../../../../pages/registration-pages/organization-create-page/organization-create-page/organization-create-page-form-model';

@Component({
  selector: 'app-user-profile-form',
  templateUrl: './user-profile-form.component.html',
})
export class UserProfileFormComponent {
  @Input() userForm!: FormGroup<RegistrationUserTabFormModel>;

  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
