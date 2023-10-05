import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {LoadingElementComponent} from './loading-element/loading-element.component';

@NgModule({
  declarations: [LoadingElementComponent],
  imports: [CommonModule],
  exports: [LoadingElementComponent],
})
export class LoadingElementModule {}
