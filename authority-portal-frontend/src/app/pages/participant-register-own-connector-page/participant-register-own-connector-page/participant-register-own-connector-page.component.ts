import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {CreateConnectorRequest} from '@sovity.de/authority-portal-client';
import {APP_CONFIG, AppConfig} from 'src/app/core/config/app-config';
import {
  Reset,
  Submit,
} from '../state/participant-register-own-connector-page-actions';
import {
  DEFAULT_PARTICIPANT_REGISTER_OWN_CONNECTOR_STATE,
  ParticipantRegisterOwnConnectorPageState,
} from '../state/participant-register-own-connector-page-state';
import {ParticipantRegisterOwnConnectorPageStateImpl} from '../state/participant-register-own-connector-page-state-impl';
import {
  ParticipantRegisterOwnConnectorPageFormModel,
  ParticipantRegisterOwnConnectorPageFormValue,
} from './participant-register-own-connector-page-form-model';

@Component({
  selector: 'app-participant-register-own-connector-page',
  templateUrl: './participant-register-own-connector-page.component.html',
  styles: [],
})
export class ParticipantRegisterOwnConnectorPageComponent
  implements OnInit, OnDestroy
{
  state = DEFAULT_PARTICIPANT_REGISTER_OWN_CONNECTOR_STATE;
  group = this.buildFormGroup();

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private store: Store,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(Reset);
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
      });
  }

  buildFormGroup(): FormGroup<ParticipantRegisterOwnConnectorPageFormModel> {
    return this.formBuilder.nonNullable.group({
      name: ['', [Validators.required]],
      location: ['', [Validators.required]],
      url: ['', [Validators.required]],
      certificate: ['', [Validators.required]],
    });
  }

  get value(): ParticipantRegisterOwnConnectorPageFormValue {
    return this.group.value;
  }

  submit(): void {
    const formValue: ParticipantRegisterOwnConnectorPageFormValue = this.value;
    const request: CreateConnectorRequest = {
      name: formValue.name!,
      location: formValue.location!,
      url: formValue.url!,
      certificate: formValue.certificate!,
    };

    this.group.disable();
    this.store.dispatch(
      new Submit(
        request,
        () => this.group.enable(),
        () => this.group.disable(),
      ),
    );
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
