import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BasicAuthUserSwitcherComponent} from './basic-auth-user-switcher/basic-auth-user-switcher.component';
import {FakeBackendUserSwitcherComponent} from './fake-backend-user-switcher/fake-backend-user-switcher.component';

@NgModule({
  imports: [CommonModule, BrowserModule],
  declarations: [
    BasicAuthUserSwitcherComponent,
    FakeBackendUserSwitcherComponent,
  ],
  exports: [BasicAuthUserSwitcherComponent, FakeBackendUserSwitcherComponent],
})
export class DevUtilsModule {}
