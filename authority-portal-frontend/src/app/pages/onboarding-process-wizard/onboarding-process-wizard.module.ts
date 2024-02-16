import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxsModule} from '@ngxs/store';
import {DevUtilsModule} from 'src/app/common/components/dev-utils/dev-utils.module';
import {PipesAndDirectivesModule} from 'src/app/common/components/pipes-and-directives/pipes-and-directives.module';
import {MaterialModule} from 'src/app/common/material/material.module';
import {SharedModule} from 'src/app/shared/shared.module';
import {OnboardingProcessWizardComponent} from './onboarding-process-wizard/onboarding-process-wizard.component';
import {OnboardingProcessWizardPageStateImpl} from './state/onboarding-process-wizard-page-state-impl';

@NgModule({
  declarations: [OnboardingProcessWizardComponent],
  imports: [
    // Angular
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    // NGXS
    NgxsModule.forFeature([OnboardingProcessWizardPageStateImpl]),

    // Authority Portal
    DevUtilsModule,
    MaterialModule,
    SharedModule,
    PipesAndDirectivesModule,
  ],
  exports: [OnboardingProcessWizardComponent],
})
export class OnboardingProcessWizardModule {}
