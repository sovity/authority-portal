import {Component, EventEmitter, HostListener, Input, Output,} from '@angular/core';

@Component({
  selector: 'app-delete-icon-button',
  templateUrl: './delete-icon-button.component.html',
})
export class DeleteIconButtonComponent {
  @Input()
  disabled = false;

  @Input()
  loading = false;

  @Output()
  deleteClick = new EventEmitter<void>();

  get canClick(): boolean {
    return !this.disabled && !this.loading;
  }

  @HostListener('click')
  onClick() {
    if (this.canClick) {
      this.deleteClick.emit();
    }
  }
}
