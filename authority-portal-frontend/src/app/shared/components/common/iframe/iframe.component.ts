import {Component, Input} from '@angular/core';
import {IframeConfig} from './iframe.model';

@Component({
  selector: 'app-iframe',
  templateUrl: './iframe.component.html',
})
export class IframeComponent {
  @Input() iframeConfig!: IframeConfig;
}
