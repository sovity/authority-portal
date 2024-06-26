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
import { Input, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';


/**
 * A type-safe version of {@link SimpleChanges}.
 *
 * Does not contain all {@link Input}s, but only simple fields.
 */
export type SimpleChangesTyped<
  Component extends object,
  Props = ExcludeFunctions<Component>,
> = {
  [Key in keyof Props]: SimpleChangeTyped<Props[Key]>;
};

export type SimpleChangeTyped<T> = {
  previousValue: T;
  currentValue: T;
  firstChange: boolean;
  isFirstChange(): boolean;
};

type MarkFunctionPropertyNames<Component> = {
  [Key in keyof Component]: Component[Key] extends Function | Subject<any>
    ? never
    : Key;
};

type ExcludeFunctionPropertyNames<T extends object> =
  MarkFunctionPropertyNames<T>[keyof T];

type ExcludeFunctions<T extends object> = Pick<
  T,
  ExcludeFunctionPropertyNames<T>
>;
