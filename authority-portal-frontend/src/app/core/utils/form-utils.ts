import {AbstractControl, FormControlStatus, FormGroup} from '@angular/forms';
import {EMPTY, Observable, concat} from 'rxjs';
import {distinctUntilChanged, map, switchMap} from 'rxjs/operators';

/**
 * Enables/Disables form groups controls
 */
export function switchDisabledControls<T>(
  ctrl: FormGroup,
  enabledCtrlsFn: (value: T) => Record<keyof T, boolean>,
) {
  const checkForChanges = () => {
    const enabledCtrls = enabledCtrlsFn(ctrl.value);
    const enabled = new Set<keyof T>(
      Object.entries(enabledCtrls)
        .filter(([_, v]) => v)
        .map(([k, _]) => k as keyof T),
    );
    Object.entries(ctrl.controls).forEach(([ctrlName, ctrl]) => {
      const ctrlNameTyped = ctrlName as keyof T;

      const currentlyDisabled = ctrl.disabled;
      const expectedDisabled = !enabled.has(ctrlNameTyped);
      if (currentlyDisabled == expectedDisabled) {
        return;
      }

      if (expectedDisabled) {
        ctrl.disable();
      } else {
        ctrl.enable();
      }
    });
  };

  status$(ctrl)
    .pipe(
      map((status) => status != 'DISABLED'),
      distinctUntilChanged(),
      switchMap((enabled) => (enabled ? value$(ctrl) : EMPTY)),
    )
    .subscribe(() => checkForChanges());
}

/**
 * Control's value as observable that also emits current value.
 */
export function value$<T>(ctrl: AbstractControl<unknown>): Observable<T> {
  return concat(
    new Observable<T>((obs) => {
      obs.next(ctrl.value as T);
      obs.complete();
    }),
    ctrl.valueChanges as Observable<T>,
  );
}

/**
 * Control's status changes as observable that also emits current status.
 */
export function status$(ctrl: AbstractControl): Observable<FormControlStatus> {
  return concat(
    new Observable<FormControlStatus>((obs) => {
      obs.next(ctrl.status);
      obs.complete();
    }),
    ctrl.statusChanges,
  );
}

export function mergeFormGroups<
  T1 extends {
    [K in keyof T1]: AbstractControl<any>;
  },
  T2 extends {
    [K in keyof T2]: AbstractControl<any>;
  },
>(group1: FormGroup<T1>, group2: FormGroup<T2>): FormGroup<T1 & T2> {
  const mergedControls: any = {};

  Object.keys(group1.controls).forEach((key) => {
    mergedControls[key] = (group1.controls as any)[key];
  });

  Object.keys(group2.controls).forEach((key) => {
    mergedControls[key] = (group2.controls as any)[key];
  });

  const nonNull = <T>(array: (T | null)[]): T[] =>
    array.filter((it) => it != null) as T[];

  return new FormGroup(
    mergedControls,
    nonNull([group1.validator, group2.validator]),
    nonNull([group1.asyncValidator, group2.asyncValidator]),
  );
}
