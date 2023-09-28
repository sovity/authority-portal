import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {CreateOrganizationRequest} from '@sovity.de/authority-portal-client';
import {APP_CONFIG, AppConfig} from '../../../core/config/app-config';
import {
  OrganizationCreatePageFormModel,
  OrganizationCreatePageFormValue,
} from './organization-create-page-form-model';
import {CreateOrganization} from './state/organization-create-page-action';
import {
  DEFAULT_ORGANIZATION_CREATE_PAGE_STATE,
  OrganizationCreatePageState,
} from './state/organization-create-page-state';
import {OrganizationCreatePageStateImpl} from './state/organization-create-page-state-impl';

@Component({
  selector: 'app-organization-create',
  templateUrl: './organization-create-page.component.html',
})
export class OrganizationCreatePageComponent implements OnInit, OnDestroy {
  state = DEFAULT_ORGANIZATION_CREATE_PAGE_STATE;
  group = this.buildFormGroup();

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private store: Store,
    private formBuilder: FormBuilder,
  ) {}

  get loading(): boolean {
    return this.state.state === 'submitting';
  }

  ngOnInit(): void {
    this.startListeningToState();
  }

  buildFormGroup(): FormGroup<OrganizationCreatePageFormModel> {
    const organizationCreateForm: FormGroup<OrganizationCreatePageFormModel> =
      this.formBuilder.nonNullable.group({
        name: ['', [Validators.required]],
        address: ['', [Validators.required]],
        duns: ['', [Validators.required]],
        url: ['', [Validators.required]],
        securityEmail: ['', [Validators.required]],
        authorizedCheck: ['', [Validators.required]],
      });
    return organizationCreateForm;
  }

  private startListeningToState() {
    this.store
      .select<OrganizationCreatePageState>(OrganizationCreatePageStateImpl)
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
      });
  }

  submit(): void {
    let formValue: OrganizationCreatePageFormValue = this.value;
    let request: CreateOrganizationRequest = {
      url: formValue.url!,
      name: formValue.name!,
      address: formValue.address!,
      duns: formValue.duns!,
      securityEmail: formValue.securityEmail!,
    };

    this.group.disable();
    this.store.dispatch(
      new CreateOrganization(
        request,
        () => this.group.enable(),
        () => this.group.disable(),
      ),
    );
  }

  get value(): OrganizationCreatePageFormValue {
    return this.group.value;
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
