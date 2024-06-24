export interface PropertyGridField {
  icon: string;

  /**
   * Title of Property
   */
  label: string;

  /**
   * Adds "title"-Attribute to Label HTML Element
   */
  labelTitle?: string;

  /**
   * Property Value
   */
  text: string;

  url?: string;
  onclick?: () => void;

  /**
   * Additional classes for the value text.
   */
  additionalClasses?: string;

  /**
   * Additional classes for the icon.
   */
  additionalIconClasses?: string;

  copyButton?: boolean;
  tooltip?: string | null;
  textIconAfter?: string | null;
}
