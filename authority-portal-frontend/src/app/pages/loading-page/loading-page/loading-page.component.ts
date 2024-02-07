import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {Store} from '@ngxs/store';
import {GlobalState} from '../../../core/global-state/global-state';
import {GlobalStateImpl} from '../../../core/global-state/global-state-impl';

@Component({
  selector: 'app-loading-page',
  templateUrl: './loading-page.component.html',
})
export class LoadingPageComponent implements OnInit, OnDestroy {
  state!: GlobalState;

  private ngOnDestroy$ = new Subject();

  constructor(private store: Store) {}

  ngOnInit() {
    this.startListeningToGlobalState();
  }

  private startListeningToGlobalState() {
    this.store
      .select<GlobalState>(GlobalStateImpl)
      .subscribe((state) => (this.state = state));
  }

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
