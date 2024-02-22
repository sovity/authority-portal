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
