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
import {UiProfileConfig} from './ui-profile-config';

/**
 * Type utility for inferring the keys of EDC_UI_PROFILE_DATA as type.
 * see https://stackoverflow.com/a/74691877
 *
 * @param profiles Record<EdcUiProfile, EdcUiProfileUtils>
 */
export const inferUiProfileType = <T extends Record<string, UiProfileConfig>>(
  profiles: T,
) => profiles;
