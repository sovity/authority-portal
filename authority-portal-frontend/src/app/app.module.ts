import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';
import {BreadcrumbComponent} from './breadcrumb/breadcrumb.component';
import {FooterComponent} from './footer/footer.component';
import {ImageSliderModule} from './image-slider/image-slider.module';
import {MainComponent} from './main/main.component';
import {ApiService} from './services/api.service';
import {provideAppConfig} from './services/config/app-config-initializer';
import {SidebarComponent} from './sidebar/sidebar.component';
import {TopPanelComponent} from './top-panel/top-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    TopPanelComponent,
    MainComponent,
    BreadcrumbComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    ImageSliderModule,
  ],
  providers: [provideAppConfig(), ApiService],
  bootstrap: [AppComponent],
})
export class AppModule {}
