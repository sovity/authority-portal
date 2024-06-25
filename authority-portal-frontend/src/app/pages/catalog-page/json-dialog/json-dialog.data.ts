import {Observable} from 'rxjs';

export interface JsonDialogData {
  title: string;
  subtitle: string;
  icon: string;
  objectForJson: unknown;
  toolbarButton?: DialogToolbarButton;
}

export interface DialogToolbarButton {
  text: string;
  icon: string;
  action: () => Observable<any> | any;
}
