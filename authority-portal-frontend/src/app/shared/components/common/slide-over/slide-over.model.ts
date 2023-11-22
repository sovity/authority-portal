export interface SlideOverConfig {
  childComponentInput: ChildComponentInput;
  label: string;
  icon: string;
  showNavigation: boolean;
}

export enum SlideOverAction {
  PREVIOUS = 'PREVIOUS',
  NEXT = 'NEXT',
}

export interface ChildComponentInput {
  id: string;
}
