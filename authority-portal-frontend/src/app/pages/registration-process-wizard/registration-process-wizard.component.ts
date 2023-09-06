import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {Store} from '@ngxs/store';
import {GlobalState} from '../../core/global-state/global-state';
import {GlobalStateImpl} from '../../core/global-state/global-state-impl';

@Component({
  selector: 'app-registration-process-wizard',
  templateUrl: './registration-process-wizard.component.html',
})
export class RegistrationProcessWizardComponent implements OnInit, OnDestroy {
  state!: GlobalState;

  get registrationStatus() {
    return this.state.userInfo.data.registrationStatus;
  }

  constructor(private store: Store) {}

  ngOnInit() {
    this.startListeningToGlobalState();
  }

  private startListeningToGlobalState() {
    this.store
      .select<GlobalState>(GlobalStateImpl)
      .subscribe((state) => (this.state = state));
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
