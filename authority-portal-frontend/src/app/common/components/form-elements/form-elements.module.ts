import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../material/material.module';
import {PipesAndDirectivesModule} from '../pipes-and-directives/pipes-and-directives.module';
import {CertificateGeneratorBarComponent} from './certificate-generator-bar/certificate-generator-bar.component';
import {CertificateInputComponent} from './certificate-input/certificate-input.component';
import {TextInputComponent} from './text-input/text-input.component';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,

    // AP
    PipesAndDirectivesModule,
  ],
  declarations: [
    CertificateGeneratorBarComponent,
    CertificateInputComponent,
    TextInputComponent,
  ],
  exports: [
    CertificateGeneratorBarComponent,
    CertificateInputComponent,
    TextInputComponent,
  ],
})
export class FormElementsModule {}
