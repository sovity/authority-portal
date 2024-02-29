import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {UserEditFormModel} from './user-edit-form-model';

@Component({
  selector: 'app-user-edit-form',
  templateUrl: './user-edit-form.component.html',
})
export class UserEditFormComponent {
  @Input() userForm!: FormGroup<UserEditFormModel>;
}
