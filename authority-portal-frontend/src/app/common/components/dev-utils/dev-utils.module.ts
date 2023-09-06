import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {UserSwitcherComponent} from './user-switcher/user-switcher.component';

@NgModule({
  imports: [CommonModule, BrowserModule],
  declarations: [UserSwitcherComponent],
  exports: [UserSwitcherComponent],
})
export class DevUtilsModule {}
