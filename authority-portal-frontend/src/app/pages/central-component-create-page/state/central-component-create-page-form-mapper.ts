import {Injectable} from '@angular/core';
import {CentralComponentCreateRequest} from '../../../../../../authority-portal-backend/authority-portal-api-client-ts';
import {CentralComponentCreatePageFormValue} from './central-component-create-page-form-model';

@Injectable()
export class CentralComponentCreatePageFormMapper {
  buildCreateRequest(
    formValue: CentralComponentCreatePageFormValue,
  ): CentralComponentCreateRequest {
    return {
      name: formValue.name,
      homepageUrl: formValue.homepageUrl || undefined,
      endpointUrl: formValue.endpointUrl,
      certificate: formValue.certificate,
    };
  }
}
