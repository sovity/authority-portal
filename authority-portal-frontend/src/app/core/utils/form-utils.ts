/*
 * Copyright (c) 2024 sovity GmbH
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Contributors:
 *      sovity GmbH - initial implementation
 */
import {AbstractControl, FormControlStatus, FormGroup} from '@angular/forms';
import {EMPTY, Observable, concat, defer, of} from 'rxjs';
import {distinctUntilChanged, map, switchMap} from 'rxjs/operators';

/**
 * Enables or disables a single control
 */
export function setEnabled(ctrl: AbstractControl, enable: boolean) {
  const disabled = ctrl.disabled;
  if (enable && disabled) {
    ctrl.enable();
  } else if (!enable && !disabled) {
    ctrl.disable();
  }
}

/**
 * Enables or disables controls of a form group depending on the value of the form group
 */
export function switchDisabledControls<T>(
  ctrl: FormGroup,
  enabledCtrlsFn: (value: T) => Record<keyof T, boolean>,
) {
  const updateDisabledStates = () => {
    const enabledCtrls = enabledCtrlsFn(ctrl.value);
    Object.entries(ctrl.controls).forEach(([ctrlName, ctrl]) =>
      setEnabled(ctrl, enabledCtrls[ctrlName as keyof T]),
    );
  };

  // Only enable/disable controls if the form group is enabled
  // This prevents messing with the disabled state of the entire form group when it's disabled
  // This also correctly sets control enabled states after lifting a form group disabled state
  const valueIfEnabled$ = status$(ctrl).pipe(
    map((status) => status != 'DISABLED'),
    distinctUntilChanged(),
    switchMap((enabled) => (enabled ? value$<T>(ctrl) : EMPTY)),
  );

  valueIfEnabled$.subscribe(() => updateDisabledStates());
}

/**
 * Control's value as observable that also emits current value.
 */
export function value$<T>(ctrl: AbstractControl<unknown>): Observable<T> {
  return concat(
    defer(() => of(ctrl.value as T)),
    ctrl.valueChanges as Observable<T>,
  );
}

/**
 * Control's status changes as observable that also emits current status.
 */
export function status$(ctrl: AbstractControl): Observable<FormControlStatus> {
  return concat(
    defer(() => of(ctrl.status)),
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
    group1.removeControl(key as any);
  });

  Object.keys(group2.controls).forEach((key) => {
    mergedControls[key] = (group2.controls as any)[key];
    group2.removeControl(key as any);
  });

  const nonNull = <T>(array: (T | null)[]): T[] =>
    array.filter((it) => it != null) as T[];

  return new FormGroup(
    mergedControls,
    nonNull([group1.validator, group2.validator]),
    nonNull([group1.asyncValidator, group2.asyncValidator]),
  );
}
