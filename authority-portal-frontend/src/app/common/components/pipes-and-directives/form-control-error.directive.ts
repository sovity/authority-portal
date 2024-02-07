import {Directive, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl} from '@angular/forms';
import {Subscription} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';

@Directive({
  selector: '[appFormControlError]',
})
export class FormControlErrorDirective implements OnInit, OnDestroy {
  @Input() control!: AbstractControl | null;
  @Input() fieldName!: string;

  public errorMessage$!: Subscription | undefined;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    const formControl = this.control as FormControl;
    this.errorMessage$ = formControl.statusChanges
      .pipe(
        debounceTime(500),
        map(() => {
          const {dirty, invalid, touched} = formControl || {};
          return (dirty || touched) && invalid
            ? this.getErrorMessage(formControl, this.fieldName)
            : '';
        }),
      )
      .subscribe((response) => {
        this.el.nativeElement.textContent = response;
      });
  }

  /**
   * this method generates a list of error messages based on the control errors object
   * @param control control
   * @param fieldName Field name to show on the error message
   * @returns
   */
  private getErrorMessage(
    control: FormControl | null,
    fieldName: string,
  ): string {
    if (!control || !control.errors) {
      return '';
    }

    const errors = control.errors;

    if (errors['required']) {
      return `${fieldName} is required`;
    }

    if (errors['email']) {
      return `${fieldName} is invalid`;
    }

    if (errors['isNotUnique']) {
      return `${fieldName} exists already`;
    }

    if (errors['mismatch']) {
      return `${fieldName}s doesn't match`;
    }

    if (errors['minlength']) {
      const {requiredLength} = errors['minlength'];
      return `${fieldName} minimum length is ${requiredLength} character${
        requiredLength !== 1 ? 's' : ''
      }`;
    }

    if (errors['invalidUrl']) {
      return `${fieldName} invalid, Please ensure it adheres to the following format: https://www.example.com`;
    }

    if (errors['errorMessage']) {
      return `Invalid Identification Credentials`;
    }

    if (errors['pattern']) {
      return `${fieldName} invalid pattern`;
    }

    if (errors['hasNumber']) {
      return `${fieldName} should contain at least one number (0-9)`;
    }

    if (errors['hasCapitalCase']) {
      return `${fieldName} should contain at least one uppercase character (A-Z)`;
    }

    if (errors['hasSmallCase']) {
      return `${fieldName} should contain at least one lowercase character (a-z)`;
    }

    if (errors['hasSpecialCharacters']) {
      return `${fieldName} should contain at least one special character !“#$%&()*+,-./:;<=>?@[\\]^_{|}~`;
    }

    return '';
  }

  ngOnDestroy(): void {
    this.errorMessage$?.unsubscribe();
  }
}
