import {defer, from, Observable} from "rxjs";

export const toObservable = <T>(fn: () => Promise<T>): Observable<T> => defer(() => from(fn()))
