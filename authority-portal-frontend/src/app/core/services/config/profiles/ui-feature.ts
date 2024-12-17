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

export type UiFeature =
  // Enables the homepage. If this is not enabled, the default page will be the Catalog
  | 'enable-home'

  // Show an iFrame on the homepage. The URL needs to be configured in the theme. Requires 'enable-home'
  | 'iframe-in-home'

  // Enables the 'Powered by sovity' footer to be used in instances hosted by sovity
  | 'powered-by-sovity'

  // Enables the Dashboard to display the Logging House status
  | 'uses-logging-house';
