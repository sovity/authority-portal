import {Pipe, PipeTransform} from '@angular/core';
import {Observable, concat, interval, of} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {formatDistanceToNow} from 'date-fns';

export type DateInput = Date | string;

/**
 * Formats date as "{n} {timeUnit} ago" or "in {n} {timeUnit}s".
 * @param date date
 */
export function formatDateAgo(date?: DateInput | null): string {
  if (!date) {
    return 'never';
  }
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return formatDistanceToNow(date, {addSuffix: true});
}

/**
 * Displays a date as estimated relative time (e.g. "3 days ago").
 */
@Pipe({name: 'ago'})
export class AgoPipe implements PipeTransform {
  interval$ = concat(of({}), interval(3000));

  transform(date?: Date | null): Observable<string> {
    return this.interval$.pipe(
      map(() => formatDateAgo(date)),
      distinctUntilChanged(),
    );
  }
}
