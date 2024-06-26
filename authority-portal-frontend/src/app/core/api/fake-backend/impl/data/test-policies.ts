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
import { UiPolicy, UiPolicyConstraint } from '@sovity.de/authority-portal-client';


export namespace TestPolicies {
  const policy = (
    constraints: UiPolicyConstraint[],
    errors: string[] = [],
  ) => ({
    policyJsonLd: JSON.stringify({
      _description:
        'The actual JSON-LD will look different. This is just data from the fake backend.',
      constraints,
    }),
    constraints,
    errors,
  });

  export const connectorRestricted: UiPolicy = policy([
    {
      left: 'REFERRING_CONNECTOR',
      operator: 'EQ',
      right: {type: 'STRING', value: 'MDSL1234XX.C1234XX'},
    },
  ]);

  export const warnings: UiPolicy = policy(
    [
      {
        left: 'SOME_UNKNOWN_PROP',
        operator: 'HAS_PART',
        right: {type: 'STRING_LIST', valueList: ['A', 'B', 'C']},
      },
    ],
    ['$.duties: Duties are currently unsupported.'],
  );
  export const failedMapping: UiPolicy = policy([], ['No constraints found!']);
}
