import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {E2EDevUserSwitcherComponent} from './e2e-dev-user-switcher/e2e-dev-user-switcher.component';
import {FakeBackendUserSwitcherComponent} from './fake-backend-user-switcher/fake-backend-user-switcher.component';

@NgModule({
  imports: [CommonModule, BrowserModule],
  declarations: [FakeBackendUserSwitcherComponent, E2EDevUserSwitcherComponent],
  exports: [FakeBackendUserSwitcherComponent, E2EDevUserSwitcherComponent],
})
export class DevUtilsModule {}
