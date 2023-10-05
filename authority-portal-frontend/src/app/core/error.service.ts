import {Injectable} from '@angular/core';
import {EMPTY, MonoTypeOperatorFunction} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class ErrorService {
  toastFailure(failureMessage: string, error?: any) {
    alert(failureMessage);
    console.error(...[failureMessage, error].filter((it) => it !== undefined));
  }

  toastFailureRxjs<T>(failureMessage: string): MonoTypeOperatorFunction<T> {
    return catchError((error) => {
      this.toastFailure(failureMessage, error);
      return EMPTY;
    });
  }
}
