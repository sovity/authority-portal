import {Directive, HostBinding, Input} from '@angular/core';

@Directive({selector: '[disabledBtn]'})
export class DisabledButtonDirective {
  @Input()
  @HostBinding('disabled')
  @HostBinding('class.opacity-50')
  @HostBinding('class.cursor-not-allowed')
  disabledBtn!: boolean;
}
