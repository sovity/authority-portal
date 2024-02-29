import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {RegistrationUserTabFormModel} from '../../../../pages/registration-pages/organization-create-page/organization-create-page/organization-create-page.form-model';

@Component({
  selector: 'app-user-create-form',
  templateUrl: './user-create-form.component.html',
})
export class UserCreateFormComponent {
  @Input() userForm!: FormGroup<RegistrationUserTabFormModel>;
}
