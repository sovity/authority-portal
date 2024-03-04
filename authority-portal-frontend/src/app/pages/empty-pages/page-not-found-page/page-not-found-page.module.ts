import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {PageNotFoundPageComponent} from './page-not-found-page/page-not-found-page.component';

@NgModule({
  declarations: [PageNotFoundPageComponent],
  imports: [CommonModule, RouterModule],
  exports: [PageNotFoundPageComponent],
})
export class PageNotFoundPageModule {}
