import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subject, interval} from 'rxjs';
import {Store} from '@ngxs/store';
import {APP_CONFIG, AppConfig} from './core/config/app-config';
import {GlobalState} from './core/global-state/global-state';
import {RefreshUserInfo} from './core/global-state/global-state-actions';
import {GlobalStateImpl} from './core/global-state/global-state-impl';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  state!: GlobalState;

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private store: Store,
  ) {}

  ngOnInit() {
    this.startListeningToGlobalState();
    this.startPollingUserInfo();
  }

  private startListeningToGlobalState() {
    this.store.select<GlobalState>(GlobalStateImpl).subscribe((state) => {
      this.state = state;
    });
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }

  private startPollingUserInfo() {
    this.store.dispatch(RefreshUserInfo);
    interval(5000).subscribe(() => this.store.dispatch(RefreshUserInfo));
  }
}
