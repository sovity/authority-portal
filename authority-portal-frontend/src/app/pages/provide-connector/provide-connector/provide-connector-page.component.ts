import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {CreateConnectorRequest} from '@sovity.de/authority-portal-client';
import {APP_CONFIG, AppConfig} from 'src/app/core/config/app-config';
import {Reset, Submit} from '../state/provide-connector-page-actions';
import {
  DEFAULT_PROVIDE_CONNECTOR_STATE,
  ProvideConnectorPageState,
} from '../state/provide-connector-page-state';
import {ProvideConnectorPageStateImpl} from '../state/provide-connector-page-state-impl';
import {
  ProvideConnectorPageFormModel,
  ProvideConnectorPageFormValue,
} from './provide-connector-page-form-model';

@Component({
  selector: 'app-provide-connector-page',
  templateUrl: './provide-connector-page.component.html',
  styles: [],
})
export class ProvideConnectorPageComponent implements OnInit, OnDestroy {
  state = DEFAULT_PROVIDE_CONNECTOR_STATE;
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
      .select<ProvideConnectorPageState>(ProvideConnectorPageStateImpl)
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
      });
  }

  buildFormGroup(): FormGroup<ProvideConnectorPageFormModel> {
    return this.formBuilder.nonNullable.group({
      name: ['', [Validators.required]],
      location: ['', [Validators.required]],
      url: ['', [Validators.required]],
      mdsId: ['', [Validators.required]],
      certificate: ['', [Validators.required]],
    });
  }

  submit(): void {
    let formValue: ProvideConnectorPageFormValue = this.group.value;
    let mdsId = formValue.mdsId!;
    let request: CreateConnectorRequest = {
      certificate: formValue.certificate!,
      location: formValue.location!,
      name: formValue.name!,
      url: formValue.url!,
    };

    this.store.dispatch(
      new Submit(
        request,
        mdsId,
        () => this.group.enable(),
        () => this.group.disable(),
      ),
    );
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy() {
    this.store.dispatch(Reset);
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
