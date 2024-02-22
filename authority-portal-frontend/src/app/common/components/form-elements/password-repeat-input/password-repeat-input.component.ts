import {Component, HostBinding, Input} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-password-repeat-input',
  templateUrl: './password-repeat-input.component.html',
})
export class PasswordRepeatInputComponent {
  @HostBinding('class.select-none')
  @HostBinding('class.flex')
  @HostBinding('class.flex-col')
  @HostBinding('class.justify-between')
  @HostBinding('class.items-center')
  cls = true;

  @Input()
  label = 'Confirm Password';

  @Input()
  ctrl: FormControl<string> = new FormControl();

  @Input()
  parentFormGroup: FormGroup = new FormGroup({});

  @Input()
  ctrlId = 'password-repeat';

  showPassword = false;
}
