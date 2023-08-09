import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';
import {ApiService} from './services/api.service';
import {provideAppConfig} from './services/config/app-config-initializer';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
  ],
  providers: [provideAppConfig(), ApiService],
  bootstrap: [AppComponent],
})
export class AppModule {}
