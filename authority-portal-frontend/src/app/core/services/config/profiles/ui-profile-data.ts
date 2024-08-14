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
import {MDS_FEATURES} from './feature-sets/mds-features';
import {inferUiProfileType} from './infer-ui-profile-type';
import {MDS_THEME, SOVITY_THEME} from './ui-theme-data';

/**
 * List of available profiles.
 *
 * This codebase supports multiple profiles since it incorporates multiple deployment targets.
 */
export const UI_PROFILE_DATA = inferUiProfileType({
  'sovity-open-source': {
    ...SOVITY_THEME,
    features: new Set(),
  },
  'mds-open-source': {
    ...MDS_THEME,
    features: new Set([...MDS_FEATURES]),
  },
});
