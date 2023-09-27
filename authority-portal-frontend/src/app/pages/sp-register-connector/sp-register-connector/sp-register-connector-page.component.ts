import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {APP_CONFIG, AppConfig} from 'src/app/core/config/app-config';
import {
  CleanRegisterConnector,
  RegisterConnector,
} from '../state/sp-register-connector-page-actions';
import {SpRegisterConnectorPageState} from '../state/sp-register-connector-page-state';
import {SpRegisterConnectorPageStateImpl} from '../state/sp-register-connector-page-state-impl';

@Component({
  selector: 'app-sp-register-connector-page',
  templateUrl: './sp-register-connector-page.component.html',
  styles: [],
})
export class SpRegisterConnectorPageComponent implements OnInit, OnDestroy {
  registerConnectorForm: FormGroup;
  state: SpRegisterConnectorPageState;

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.registerConnectorForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      url: new FormControl('', [Validators.required]),
      mdsId: new FormControl('', [Validators.required]),
      certificate: new FormControl('', [Validators.required]),
    });
    this.startListeningToState();
  }

  private startListeningToState() {
    this.store
      .select<SpRegisterConnectorPageState>(SpRegisterConnectorPageStateImpl)
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
        if (state.response.isError) {
          this.registerConnectorForm.enable();
        }
      });
  }

  submit(): void {
    const formWithoutMds = Object.fromEntries(
      Object.entries(this.registerConnectorForm.value).filter(
        ([key, value]) => key !== 'mdsId',
      ),
    );
    this.store.dispatch(
      new RegisterConnector(
        formWithoutMds,
        this.registerConnectorForm.value.mdsId,
      ),
    );

    this.registerConnectorForm.disable();
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy() {
    this.store.dispatch(CleanRegisterConnector);
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
