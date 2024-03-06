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
import {Provider} from '@angular/core';

/**
 * Type for creating type-safe Jasmine Spies
 */
export type Spied<T> = {
  [Method in keyof T]: jasmine.Spy;
};

export type ConstructorOf<T> = new (...args: any[]) => T;

/**
 * Provide spies for units in tests
 * @param type service class
 * @param spy spy
 */
export function provideSpy<T>(type: ConstructorOf<T>, spy: Spied<T>): Provider {
  return {provide: type, useValue: spy};
}
