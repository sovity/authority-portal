/*
 * Copyright (c) 2024 sovity GmbH
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Contributors:
 *      sovity GmbH - initial implementation
 */

import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  Output,
} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {SlideOverService} from 'src/app/shared/services/slide-over.service';
import {
  DEFAULT_SLIDE_OVER_STATE,
  NavigationType,
  SlideOverAction,
} from './slide-over.model';

@Component({
  selector: 'app-slide-over',
  templateUrl: './slide-over.component.html',
})
export class SlideOverComponent implements OnChanges, OnDestroy {
  @Input() component: any;

  @Output() close = new EventEmitter();
  @Output() navigate = new EventEmitter();

  state = DEFAULT_SLIDE_OVER_STATE;
  childComponentInputId!: string;
  dynamicComponentInjector!: Injector;

  private ngOnDestroy$ = new Subject();

  constructor(
    private injector: Injector,
    private slideOverService: SlideOverService,
  ) {}

  ngOnChanges() {
    this.startListeningToState();
  }

  private startListeningToState() {
    this.slideOverService.slideOverState$
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
        if (
          this.state.config.childComponentInput.id !==
          this.childComponentInputId
        ) {
          this.childComponentInputId = this.state.config.childComponentInput.id;
          this.dynamicComponentInjector = Injector.create({
            parent: this.injector,
            providers: [
              {
                provide: 'childComponentInput',
                useValue: this.state.config.childComponentInput,
              },
            ],
          });
        }
      });
  }

  /**
   * Handle the slide over close
   */
  onClose() {
    this.close.emit();
    this.slideOverService.slideOverReset();
  }

  /**
   * Handles the navigation of the slide over
   * @param direction
   */
  onNavigate(direction: string) {
    this.navigate.emit(direction as SlideOverAction);
  }

  onGoBack() {
    this.slideOverService.setSlideOverViewToPreviousView();
    this.slideOverService.setSlideOverNavigationType(NavigationType.STEPPER);
  }

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
