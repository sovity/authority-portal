import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {Reset, Submit} from '../state/central-component-create-page-actions';
import {CentralComponentCreatePageForm} from '../state/central-component-create-page-form';
import {CentralComponentCreatePageFormMapper} from '../state/central-component-create-page-form-mapper';
import {
  CentralComponentCreatePageState,
  DEFAULT_CENTRAL_COMPONENT_CREATE_STATE,
} from '../state/central-component-create-page-state';
import {CentralComponentCreatePageStateImpl} from '../state/central-component-create-page-state-impl';

@Component({
  selector: 'app-central-component-create-page',
  templateUrl: './central-component-create-page.component.html',
  providers: [
    CentralComponentCreatePageForm,
    CentralComponentCreatePageFormMapper,
  ],
})
export class CentralComponentCreatePageComponent implements OnInit, OnDestroy {
  @HostBinding('class.overflow-y-auto')
  cls = true;

  state = DEFAULT_CENTRAL_COMPONENT_CREATE_STATE;

  private ngOnDestroy$ = new Subject();

  constructor(
    private store: Store,
    public form: CentralComponentCreatePageForm,
    private formMapper: CentralComponentCreatePageFormMapper,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(Reset);
    this.startListeningToState();
  }

  submit(): void {
    const formValue = this.form.value;
    const request = this.formMapper.buildCreateRequest(formValue);

    this.store.dispatch(
      new Submit(
        request,
        () => this.form.group.enable(),
        () => this.form.group.disable(),
      ),
    );
  }

  private startListeningToState() {
    this.store
      .select<CentralComponentCreatePageState>(
        CentralComponentCreatePageStateImpl,
      )
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
      });
  }

  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
