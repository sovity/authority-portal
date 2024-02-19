export interface SelectionBoxModel {
  title: string;
  subTitle?: string;
  icon?: string;
  bulletPoints?: string[];
  action?: {
    label?: string;
    url?: string;
    externalUrl?: string;
    isLoading?: boolean;
    isDisabled?: boolean;
    hint?: string;
  };
}
