import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {DevUtilsModule} from 'src/app/common/components/dev-utils/dev-utils.module';
import {PipesAndDirectivesModule} from 'src/app/common/components/pipes-and-directives/pipes-and-directives.module';
import {MaterialModule} from 'src/app/common/material/material.module';
import {SharedModule} from 'src/app/shared/shared.module';
import {UnauthenticatedPageComponent} from './unauthenticated-page/unauthenticated-page.component';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    // Authority Portal
    DevUtilsModule,
    MaterialModule,
    SharedModule,
    PipesAndDirectivesModule,
  ],
  declarations: [UnauthenticatedPageComponent],
  exports: [UnauthenticatedPageComponent],
})
export class UnauthenticatedPageModule {}
