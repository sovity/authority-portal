import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {UserProfileUpdateFormModel} from 'src/app/pages/onboarding-process-wizard/onboarding-process-wizard/onboarding-process-wizard.model';

@Component({
  selector: 'app-user-profile-update-form',
  templateUrl: './user-profile-update-form.component.html',
})
export class UserProfileUpdateFormComponent {
  @Input() formGroup!: FormGroup<UserProfileUpdateFormModel>;
}
