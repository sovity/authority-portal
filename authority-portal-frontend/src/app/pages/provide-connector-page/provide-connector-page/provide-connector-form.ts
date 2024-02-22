import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {urlValidator} from 'src/app/core/utils/validators/url-validator';
import {buildCertificateInputForm} from '../../../common/components/form-elements/certificate-input-form/certificate-input-form-builder';
import {certificateInputFormEnabledCtrls} from '../../../common/components/form-elements/certificate-input-form/certificate-input-form-enabled-ctrls';
import {switchDisabledControls} from '../../../core/utils/form-utils';
import {
  DEFAULT_PROVIDE_WIZARD_FORM_VALUE,
  ProvideCertificateTabFormModel,
  ProvideCertificateTabFormValue,
  ProvideConnectorTabFormModel,
  ProvideWizardFormModel,
  ProvideWizardFormValue,
} from './provide-connector-tab-form-model';

@Injectable()
export class ProvideConnectorForm {
  group = this.buildFormGroup();

  get connectorTab(): FormGroup<ProvideConnectorTabFormModel> {
    return this.group.controls.connectorTab;
  }

  get certificateTab(): FormGroup<ProvideCertificateTabFormModel> {
    return this.group.controls.certificateTab;
  }

  get value(): ProvideWizardFormValue {
    return this.group.value as ProvideWizardFormValue;
  }

  constructor(private formBuilder: FormBuilder) {}

  buildFormGroup(): FormGroup<ProvideWizardFormModel> {
    const initial = DEFAULT_PROVIDE_WIZARD_FORM_VALUE;

    const connectorTab = this.formBuilder.nonNullable.group({
      name: [initial.connectorTab.name, [Validators.required]],
      location: [initial.connectorTab.location, [Validators.required]],
      frontendUrl: [
        initial.connectorTab.frontendUrl,
        [Validators.required, urlValidator],
      ],
      endpointUrl: [
        initial.connectorTab.endpointUrl,
        [Validators.required, urlValidator],
      ],
      managementUrl: [
        initial.connectorTab.managementUrl,
        [Validators.required, urlValidator],
      ],
      organization: [initial.connectorTab.organization, [Validators.required]],
    });

    const certificateTab = buildCertificateInputForm(
      this.formBuilder,
      initial.certificateTab,
    );

    switchDisabledControls<ProvideCertificateTabFormValue>(
      certificateTab,
      (value) => certificateInputFormEnabledCtrls(value),
    );

    return this.formBuilder.nonNullable.group({
      canSwitchTabs: [true, Validators.requiredTrue],
      connectorTab,
      certificateTab,
    });
  }
}
