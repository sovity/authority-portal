import {Injectable} from '@angular/core';
import {CentralComponentCreateRequest} from '@sovity.de/authority-portal-client';
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
