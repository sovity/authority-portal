import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../../shared/shared.module';
import {PageNotFoundPageComponent} from './page-not-found-page/page-not-found-page.component';

@NgModule({
  declarations: [PageNotFoundPageComponent],
  imports: [CommonModule, RouterModule, SharedModule],
  exports: [PageNotFoundPageComponent],
})
export class PageNotFoundPageModule {}
