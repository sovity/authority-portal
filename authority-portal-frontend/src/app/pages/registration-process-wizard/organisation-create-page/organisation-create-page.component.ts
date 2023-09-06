import {Component, Inject, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {finalize, takeUntil} from 'rxjs/operators';
import {Store} from '@ngxs/store';
import {CreateOrganizationRequest} from '@sovity.de/authority-portal-client';
import {ApiService} from '../../../core/api/api.service';
import {APP_CONFIG, AppConfig} from '../../../core/config/app-config';
import {RefreshUserInfo} from '../../../core/global-state/global-state-actions';
import {OrganizationCreateFormValue} from './form/organization-create-form';
import {OrganizationCreateFormImpl} from './form/organization-create-form-impl';

@Component({
  selector: 'app-organisation-create',
  templateUrl: './organisation-create-page.component.html',
  providers: [OrganizationCreateFormImpl],
})
export class OrganisationCreatePageComponent implements OnDestroy {
  loading = false;
  submitted = false;

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    public form: OrganizationCreateFormImpl,
    private apiService: ApiService,
    private store: Store,
  ) {}

  submit(): void {
    if (!this.form.form.valid || this.loading || this.submitted) {
      return;
    }

    const formValue: OrganizationCreateFormValue = this.form.getValue();
    const request: CreateOrganizationRequest =
      this.buildCreateRequest(formValue);

    console.log('organization create page submit', formValue, request);

    this.loading = true;
    this.form.form.disable();

    this.apiService
      .createOrganization(request)
      .pipe(
        takeUntil(this.ngOnDestroy$),
        finalize(() => {
          this.loading = false;
          this.form.form.enable();
        }),
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          this.loading = false;
          this.submitted = true;

          // Refresh User Information
          // A new registration status should make us switch pages
          this.store.dispatch(RefreshUserInfo);
        },
        error: (error) => {
          console.error(error);
          alert('Failed creating organization!');
        },
      });
  }

  private buildCreateRequest(
    formValue: OrganizationCreateFormValue,
  ): CreateOrganizationRequest {
    return {
      name: formValue.companyName!!.trim(),
      address: formValue.address!!.trim(),
      duns: formValue.duns!!.trim(),
      url: formValue.url!!.trim(),
      securityEmail: formValue.securityEmail!!.trim(),
    };
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
