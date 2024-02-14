export interface ConfirmationDialog {
  title: string;
  messageBody: string;
  actionButtons: ConfirmationDialogAction[];
}

export interface ConfirmationDialogAction {
  action: string;
  label: string;
  style?: string;
}
