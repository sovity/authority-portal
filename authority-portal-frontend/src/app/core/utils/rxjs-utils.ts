import {defer, from, Observable, OperatorFunction} from "rxjs";
import {filter} from 'rxjs/operators';

export const toObservable = <T>(fn: () => Promise<T>): Observable<T> => defer(() => from(fn()))

/**
 * Simple not null filtering RXJS Operator.
 *
 * The trick is that it removes the "null | undefined" from the resulting stream type signature.
 */
export function filterNotNull<T>(): OperatorFunction<T | null | undefined, T> {
  return filter((it) => it != null) as any;
}
