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
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import {Subject, combineLatest, map, takeUntil} from 'rxjs';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {isEllipsisActive} from 'src/app/core/utils/text-ellipsis-utils';
import {SlideOverService} from 'src/app/core/services/slide-over.service';
import {MenuOption, TitleBarConfig} from './title-bar.model';

@Component({
  selector: 'app-title-bar',
  templateUrl: './title-bar.component.html',
})
export class TitleBarComponent implements OnDestroy {
  isEllipsisActive: boolean = true;
  @Input() titleBarConfig!: TitleBarConfig;
  @Input() selectedTab!: string;
  @Output() onTabChange = new EventEmitter<string>();

  @ViewChild('title', {static: true})
  title?: ElementRef;

  private ngOnDestroy$ = new Subject();

  constructor(
    private slideOverService: SlideOverService,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  ngAfterViewInit() {
    this.isEllipsisActive = isEllipsisActive(this.title?.nativeElement);
  }

  tabChanged(view: string) {
    this.onTabChange.emit(view);
  }

  menuActionPressed(menuItem: MenuOption) {
    menuItem.event(this.titleBarConfig.actionMenu!.id);
  }

  isAllDisabled(titleBarConfig: TitleBarConfig): boolean {
    return (
      !titleBarConfig.actionMenu ||
      (titleBarConfig.actionMenu &&
        titleBarConfig.actionMenu.menuOptions.every(
          (option) => option.isDisabled,
        ))
    );
  }

  getTitleMaxWidthPx(): string {
    // Slideover title width 762.5px
    const slideOverContentMaxWidth = 762;

    const actionMenuButtonWidth =
      this.titleBarConfig.actionMenu?.menuOptions?.some((it) => !it.isDisabled)
        ? 68
        : 0;

    // Titlebar tab width = 64px with 4px gap
    const rightFlexWidth =
      this.titleBarConfig.tabs.length * 64 +
      (this.titleBarConfig.tabs.length - 1) * 4 +
      actionMenuButtonWidth;

    // Title 2x 8px padding
    const titlePaddingWidth = 16;

    // Title flex 2x 4px gap
    const titleFlexGapWidth = 8;

    // 36px icon
    // Variable status width of ~10.6px per char
    const leftFlexExceptTitleWidth =
      titlePaddingWidth +
      titleFlexGapWidth +
      36 +
      10.6 * this.titleBarConfig.status.length * 1.2;

    const titleMaxWidth =
      slideOverContentMaxWidth - rightFlexWidth - leftFlexExceptTitleWidth - 54;

    return `${titleMaxWidth}px`;
  }

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
