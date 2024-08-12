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
import {PolicyExpressionMapped} from '../policy-editor/model/policy-expression-mapped';

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
  text?: string;

  url?: string;
  onclick?: () => void;

  /**
   * Additional classes for the value text.
   */
  additionalClasses?: string;

  /**
   * Additional classes for the container
   */
  additionalContainerClasses?: string;

  /**
   * Additional classes for the icon.
   */
  additionalIconClasses?: string;

  copyButton?: boolean;
  tooltip?: string | null;
  textIconAfter?: string | null;

  policy?: PolicyExpressionMapped;
  policyErrors?: string[];

  /**
   * Hide text
   */
  hideFieldValue?: boolean;
}
