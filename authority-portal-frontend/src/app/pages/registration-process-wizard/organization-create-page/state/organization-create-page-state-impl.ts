import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ignoreElements, tap} from 'rxjs/operators';
import {Action, State, StateContext} from '@ngxs/store';
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
  constructor(private apiService: ApiService) {}

  @Action(CreateOrganization, {cancelUncompleted: true})
  onCreateOrganization(
    ctx: StateContext<OrganizationCreatePageState>,
    action: CreateOrganization,
  ): Observable<never> {
    return this.apiService.createOrganization(action.formValue).pipe(
      Fetched.wrap({failureMessage: 'Failed creating organization'}),
      tap((response) => {
        if (response.state === 'ready') {
          window.location.reload();
        } else if (response.state === 'error') {
          ctx.patchState({response});
        }
      }),
      ignoreElements(),
    );
  }
}
