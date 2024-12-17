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
import {inferUiProfileType} from './infer-ui-profile-type';
import {SOVITY_THEME} from './ui-theme-data';

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
});
