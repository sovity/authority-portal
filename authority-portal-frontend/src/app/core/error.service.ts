import {Injectable} from '@angular/core';
import {EMPTY, MonoTypeOperatorFunction} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ToastService} from './toast-notifications/toast.service';

@Injectable({providedIn: 'root'})
export class ErrorService {
  constructor(private toastService: ToastService) {}

  toastFailure(failureMessage: string, error?: any) {
    this.toastService.showDanger(failureMessage);
    console.error(...[failureMessage, error].filter((it) => it !== undefined));
  }

  toastFailureRxjs<T>(
    failureMessage: string,
    onError?: () => void,
  ): MonoTypeOperatorFunction<T> {
    return catchError((error) => {
      this.toastFailure(failureMessage, error);
      if (onError) {
        onError();
      }
      return EMPTY;
    });
  }
}
