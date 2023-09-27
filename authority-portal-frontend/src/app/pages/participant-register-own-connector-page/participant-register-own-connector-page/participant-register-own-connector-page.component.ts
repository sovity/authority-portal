import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {APP_CONFIG, AppConfig} from 'src/app/core/config/app-config';
import {
  CleanRegisterOwnConnector,
  RegisterOwnConnector,
} from '../state/participant-register-own-connector-page-actions';
import {
  DEFAULT_PARTICIPANT_REGISTER_OWN_CONNECTOR_STATE,
  ParticipantRegisterOwnConnectorPageState,
} from '../state/participant-register-own-connector-page-state';
import {ParticipantRegisterOwnConnectorPageStateImpl} from '../state/participant-register-own-connector-page-state-impl';

@Component({
  selector: 'app-participant-register-own-connector-page',
  templateUrl: './participant-register-own-connector-page.component.html',
  styles: [],
})
export class ParticipantRegisterOwnConnectorPageComponent
  implements OnInit, OnDestroy
{
  registerOwnConnectorForm: FormGroup;
  state = DEFAULT_PARTICIPANT_REGISTER_OWN_CONNECTOR_STATE;

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.registerOwnConnectorForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      url: new FormControl('', [Validators.required]),
      certificate: new FormControl('', [Validators.required]),
    });
    this.startListeningToState();
  }

  private startListeningToState() {
    this.store
      .select<ParticipantRegisterOwnConnectorPageState>(
        ParticipantRegisterOwnConnectorPageStateImpl,
      )
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
        if (state.response.isError) {
          this.registerOwnConnectorForm.enable();
        }
      });
  }

  submit(): void {
    this.store.dispatch(
      new RegisterOwnConnector(this.registerOwnConnectorForm.value),
    );

    this.registerOwnConnectorForm.disable();
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy() {
    this.store.dispatch(CleanRegisterOwnConnector);
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
