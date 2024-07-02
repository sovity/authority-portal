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

export interface SlideOverState {
  config: SlideOverConfig;
  currentView: SlideOverViews;
  previousView: SlideOverViews;
}

export interface SlideOverViews {
  viewName: string;
  viewData?: string;
}

export interface SlideOverConfig {
  childComponentInput: ChildComponentInput;
  label: string;
  icon: string;
  showNavigation: boolean;
  navigationType: NavigationType;
}

export enum SlideOverAction {
  PREVIOUS = 'PREVIOUS',
  NEXT = 'NEXT',
}

export enum NavigationType {
  STEPPER = 'STEPPER',
  GO_BACK = 'GO_BACK',
}

export interface ChildComponentInput {
  id: string;
}

export const DEFAULT_SLIDE_OVER_STATE: SlideOverState = {
  config: {
    childComponentInput: {
      id: '',
    },
    label: '',
    icon: '',
    showNavigation: false,
    navigationType: NavigationType.STEPPER,
  },
  currentView: {viewName: ''},
  previousView: {viewName: ''},
};
