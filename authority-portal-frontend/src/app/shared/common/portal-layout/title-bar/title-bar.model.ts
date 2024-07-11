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

export interface TitleBarConfig {
  title: string;
  icon: string;
  status: string;
  statusStyle: string;
  tabs: SlideOverTab[];
  actionMenu?: ActionMenu;
}

export interface SlideOverTab {
  icon: string;
  view: any;
  isDisabled: boolean;
  value?: number;
  tooltip?: string;
}

export interface ActionMenu {
  id: string;
  menuOptions: MenuOption[];
}

export interface MenuOption {
  label: string;
  icon: string;
  event: (menuId: string) => void;
  isDisabled: boolean;
}

export interface TitleBarMenuActionEvent {
  menuId: string;
  event: string;
}
