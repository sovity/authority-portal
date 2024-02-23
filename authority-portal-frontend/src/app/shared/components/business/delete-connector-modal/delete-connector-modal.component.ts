import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-delete-connector-modal',
  templateUrl: './delete-connector-modal.component.html',
})
export class DeleteConnectorModalComponent {
  @Input() visible!: boolean;
  @Input() isCaasConnector!: boolean;
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() confirm: EventEmitter<any> = new EventEmitter();
}
