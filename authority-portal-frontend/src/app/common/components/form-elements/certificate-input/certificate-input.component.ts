import {Component, HostBinding, Input} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-certificate-input',
  templateUrl: './certificate-input.component.html',
})
export class CertificateInputComponent {
  @HostBinding('class.flex')
  @HostBinding('class.flex-col')
  cls = true;

  @Input()
  ctrl: FormControl<string> = new FormControl();

  @Input()
  ctrlId = 'certificate-input';
}
