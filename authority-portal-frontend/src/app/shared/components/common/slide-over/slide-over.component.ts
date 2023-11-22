import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import {SlideOverAction, SlideOverConfig} from './slide-over.model';

@Component({
  selector: 'app-slide-over',
  templateUrl: './slide-over.component.html',
})
export class SlideOverComponent implements OnChanges {
  @Input() component: any;
  @Input() slideOverConfig!: SlideOverConfig;
  @Output() close = new EventEmitter();
  @Output() navigate = new EventEmitter();

  dynamicComponentInjector!: Injector;

  constructor(private injector: Injector) {}

  ngOnChanges() {
    this.dynamicComponentInjector = Injector.create({
      parent: this.injector,
      providers: [
        {
          provide: 'childComponentInput',
          useValue: this.slideOverConfig.childComponentInput,
        },
      ],
    });
  }

  /**
   * Handle the slide over close
   */
  onClose() {
    this.close.emit();
  }

  /**
   * Handles the navigation of the slide over
   * @param direction
   */
  onNavigate(direction: string) {
    this.navigate.emit(direction as SlideOverAction);
  }
}
