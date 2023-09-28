import {Inject, Injectable} from '@angular/core';
import {EMPTY, Observable} from 'rxjs';
import {catchError, ignoreElements, tap} from 'rxjs/operators';
import {Action, State, StateContext} from '@ngxs/store';
import {APP_CONFIG, AppConfig} from 'src/app/core/config/app-config';
import {ApiService} from '../../../../core/api/api.service';
import {Fetched} from '../../../../core/utils/fetched';
import {CreateOrganization} from './organization-create-page-action';
import {
  DEFAULT_ORGANIZATION_CREATE_PAGE_STATE,
  OrganizationCreatePageState,
} from './organization-create-page-state';

@State<OrganizationCreatePageState>({
  name: 'OrganizationCreatePage',
  defaults: DEFAULT_ORGANIZATION_CREATE_PAGE_STATE,
})
@Injectable()
export class OrganizationCreatePageStateImpl {
  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private apiService: ApiService,
  ) {}

  @Action(CreateOrganization, {cancelUncompleted: true})
  onCreateOrganization(
    ctx: StateContext<OrganizationCreatePageState>,
    action: CreateOrganization,
  ): Observable<never> {
    ctx.patchState({state: 'submitting'});
    action.disableForm();
    return this.apiService.createOrganization(action.request).pipe(
      tap(() => {
        ctx.patchState({state: 'success'});
        console.log(
          'Organization created, redirecting user to:',
          this.config.invalidateSessionCookiesUrl,
        );
        window.location.replace(this.config.invalidateSessionCookiesUrl);
      }),
      catchError((error) => {
        console.error('Failed creating organization', error);
        ctx.patchState({state: 'error'});
        action.enableForm();
        return EMPTY;
      }),
      ignoreElements(),
    );
  }
}
