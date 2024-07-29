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
import {UiProfile} from './ui-profile';
import {UiProfileConfig} from './ui-profile-config';
import {UI_PROFILE_DATA} from './ui-profile-data';

/**
 * Find profile (or default to first)
 * @param profile profile
 */
export function getProfileOrFallback(profile?: string | null): {
  profile: UiProfile;
  profileConfig: UiProfileConfig;
} {
  if (UI_PROFILE_DATA[profile as UiProfile]) {
    return {
      profile: profile as UiProfile,
      profileConfig: UI_PROFILE_DATA[profile as UiProfile],
    };
  }

  const fallback: UiProfile = 'sovity-open-source';

  const availableProfiles = Object.keys(UI_PROFILE_DATA)
    .map((s) => `"${s}"`)
    .join(', ');

  console.error(
    `Invalid profile: ${JSON.stringify(profile)}.`,
    `Expected one of ${availableProfiles}.`,
    `Falling back to ${JSON.stringify(fallback)}'.`,
  );

  return {
    profile: fallback,
    profileConfig: UI_PROFILE_DATA[fallback],
  };
}
