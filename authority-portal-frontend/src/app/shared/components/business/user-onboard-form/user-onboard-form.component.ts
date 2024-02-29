import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {UserOnboardFormModel} from './user-onboard-form-model';

@Component({
  selector: 'app-user-onboard-form',
  templateUrl: './user-onboard-form.component.html',
})
export class UserOnboardFormComponent {
  @Input() userForm!: FormGroup<UserOnboardFormModel>;
}
