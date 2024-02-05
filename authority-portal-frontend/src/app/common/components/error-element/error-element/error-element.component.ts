import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-error-element',
  templateUrl: './error-element.component.html',
})
export class ErrorElementComponent {
  @Input() errorMessage: string = '';
}
