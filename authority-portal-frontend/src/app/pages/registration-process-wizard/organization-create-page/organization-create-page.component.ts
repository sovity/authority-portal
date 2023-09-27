import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {APP_CONFIG, AppConfig} from '../../../core/config/app-config';
import {DEFAULT_AUTHORITY_ORGANIZATION_DETAIL_PAGE_STATE} from '../../authority-organization-detail-page/state/authority-organization-detail-page-state';
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
  loading = false;
  submitted = false;
  organizationCreateForm: FormGroup;
  state = DEFAULT_ORGANIZATION_CREATE_PAGE_STATE;

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.organizationCreateForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      duns: new FormControl('', [Validators.required]),
      url: new FormControl('', [Validators.required]),
      securityEmail: new FormControl('', [Validators.required]),
      authorizedCheck: new FormControl('', [Validators.required]),
    });

    this.startListeningToState();

    this.store.subscribe((state) => {
      if (state.OrganizationCreatePage.response.error) {
        this.organizationCreateForm.enable();
        this.loading = false;
        this.submitted = false;
      }
    });
  }

  private startListeningToState() {
    this.store
      .select<OrganizationCreatePageState>(OrganizationCreatePageStateImpl)
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
        if (state.response.error) {
          this.organizationCreateForm.enable();
          this.loading = false;
          this.submitted = false;
        }
      });
  }

  submit(): void {
    this.store.dispatch(
      new CreateOrganization(this.organizationCreateForm.value),
    );
    this.submitted = true;
    this.organizationCreateForm.disable();
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
