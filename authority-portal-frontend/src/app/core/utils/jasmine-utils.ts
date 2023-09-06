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
