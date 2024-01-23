import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {MaterialModule} from 'src/app/common/material/material.module';
import {E2EDevUserSwitcherComponent} from './e2e-dev-user-switcher/e2e-dev-user-switcher.component';
import {EnvBannerComponent} from './env-banner/env-banner.component';
import {EnvSwitcherComponent} from './env-switcher/env-switcher.component';
import {FakeBackendUserSwitcherComponent} from './fake-backend-user-switcher/fake-backend-user-switcher.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  declarations: [
    FakeBackendUserSwitcherComponent,
    E2EDevUserSwitcherComponent,
    EnvSwitcherComponent,
    EnvBannerComponent,
  ],
  exports: [
    FakeBackendUserSwitcherComponent,
    E2EDevUserSwitcherComponent,
    EnvSwitcherComponent,
    EnvBannerComponent,
  ],
})
export class DevUtilsModule {}
