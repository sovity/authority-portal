import {Injectable, NgZone} from '@angular/core';
import {NgxsExecutionStrategy} from '@ngxs/store';

@Injectable({providedIn: 'root'})
export class NgxsInZoneExecutionStrategy implements NgxsExecutionStrategy {
  constructor(private zone: NgZone) {}

  enter<T>(func: () => T): T {
    return this.zone.run(() => func());
  }

  leave<T>(func: () => T): T {
    return this.zone.runOutsideAngular(() => func());
  }
}
