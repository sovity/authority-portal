import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {LoadingPageComponent} from './loading-page/loading-page.component';

@NgModule({
  declarations: [LoadingPageComponent],
  imports: [CommonModule],
  exports: [LoadingPageComponent],
})
export class LoadingPageModule {}
