import {Component, Input} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
})
export class InputComponent {
  @Input() control!: FormControl;
  @Input() label!: string;

  get cssClasses(): string {
    let cssClasses = this.containsErrors()
      ? 'FormInputError'
      : 'FormInputBasic';
    if (this.nullErrors()) {
      cssClasses += ' FormInputValid';
    }
    return cssClasses;
  }

  containsErrors() {
    return this.control?.dirty && this.control.touched && this.control.errors;
  }

  nullErrors() {
    return (
      this.control?.dirty &&
      this.control.touched &&
      this.control.errors === null
    );
  }
}
