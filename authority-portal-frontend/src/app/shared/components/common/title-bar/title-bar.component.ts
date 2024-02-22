import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
} from '@angular/core';
import {Subject, combineLatest, map, takeUntil} from 'rxjs';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {SlideOverService} from 'src/app/shared/services/slide-over.service';
import {MenuOption, TitleBarConfig} from './title-bar.model';

@Component({
  selector: 'app-title-bar',
  templateUrl: './title-bar.component.html',
})
export class TitleBarComponent implements OnChanges, OnDestroy {
  @Input() titleBarConfig!: TitleBarConfig;
  @Input() selectedTab!: string;
  @Output() onTabChange = new EventEmitter<string>();

  private ngOnDestroy$ = new Subject();

  constructor(
    private slideOverService: SlideOverService,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  ngOnChanges(): void {
    combineLatest([
      this.globalStateUtils.userInfo$,
      this.slideOverService.slideOverState$,
    ])
      .pipe(
        takeUntil(this.ngOnDestroy$),
        map(([userInfo, slideOverState]) => {
          if (userInfo.userId === slideOverState.currentView?.viewData) {
            this.titleBarConfig.actionMenu?.menuOptions.forEach((menu) => {
              menu.isDisabled = true;
            });
          }
        }),
      )
      .subscribe();
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

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
