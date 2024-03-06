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

import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {
  DEFAULT_SLIDE_OVER_STATE,
  NavigationType,
  SlideOverConfig,
  SlideOverState,
  SlideOverViews,
} from '../components/common/slide-over/slide-over.model';

@Injectable({
  providedIn: 'root',
})
export class SlideOverService {
  private slideOverSubject = new BehaviorSubject<SlideOverState>(
    DEFAULT_SLIDE_OVER_STATE,
  );

  slideOverState$ = this.slideOverSubject.asObservable();
  /**
   * Set SlideOver Component Configuration
   */
  setSlideOverConfig(slideOverConfig: SlideOverConfig) {
    let slideOverState = this._getSlideOverState();
    this._updateSlideOverState({
      ...slideOverState,
      config: slideOverConfig,
    });
  }

  /**
   * Set SlideOver Component Navigation Type
   */
  setSlideOverNavigationType(navigationType: NavigationType) {
    let slideOverState = this._getSlideOverState();
    this._updateSlideOverState({
      ...slideOverState,
      config: {
        ...slideOverState.config,
        navigationType: navigationType,
      },
    });
  }

  /**
   * Set SlideOver Component Current & Previous View
   * @param currentView
   * @param previousView
   */
  setSlideOverViews(currentView: SlideOverViews, previousView: SlideOverViews) {
    let slideOverState = this._getSlideOverState();
    this._updateSlideOverState({
      ...slideOverState,
      currentView: currentView,
      previousView: previousView,
    });
  }

  /**
   * Set SlideOver Component Current View To Previous View
   */
  setSlideOverViewToPreviousView() {
    let slideOverState = this._getSlideOverState();

    this._updateSlideOverState({
      ...slideOverState,
      currentView: slideOverState.previousView,
      previousView: {viewName: ''},
    });
  }

  /**
   * Reset SlideOver Component
   */
  slideOverReset() {
    this._updateSlideOverState(DEFAULT_SLIDE_OVER_STATE);
  }

  /**
   * updates SlideOver State
   * @param slideOverState
   */
  _updateSlideOverState(slideOverState: SlideOverState): void {
    this.slideOverSubject.next(slideOverState);
  }

  /**
   * get Slide-over state
   * @returns SlideOver
   */
  _getSlideOverState(): SlideOverState {
    return this.slideOverSubject.getValue();
  }
}
