import {AbstractControl} from '@angular/forms';

export function setEnabled(ctrl: AbstractControl, enabled: boolean) {
  if (enabled) {
    ctrl.enable();
  } else {
    ctrl.disable();
  }
}
