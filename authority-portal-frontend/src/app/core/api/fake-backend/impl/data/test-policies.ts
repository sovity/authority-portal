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
import {UiPolicy, UiPolicyExpression} from '@sovity.de/authority-portal-client';
import {policyLeftExpressions} from '../../../../../pages/catalog-page/policy-editor/model/policy-left-expressions';
import {
  constraint,
  constraintList,
  multi,
} from '../../../../../pages/catalog-page/policy-editor/model/ui-policy-expression-utils';

export namespace TestPolicies {
  const policy = (
    expression: UiPolicyExpression,
    errors: string[] = [],
  ): UiPolicy => ({
    policyJsonLd: JSON.stringify({
      _description:
        'The actual JSON-LD will look different. This is just data from the fake backend.',
      expression,
    }),
    expression,
    errors,
  });

  export const connectorRestricted: UiPolicy = policy(
    multi(
      'AND',
      constraint(
        policyLeftExpressions.policyEvaluationTime,
        'GEQ',
        '2021-01-01',
      ),
      constraint(
        policyLeftExpressions.policyEvaluationTime,
        'LT',
        '2025-01-01',
      ),
      multi(
        'OR',
        constraint('REFERRING_CONNECTOR', 'EQ', 'MDSL1234XX.C1234XX'),
        constraint('REFERRING_CONNECTOR', 'EQ', 'MDSL1234XX.C1235YY'),
      ),
      constraint('ALWAYS_TRUE', 'EQ', 'true'),
    ),
  );

  export const warnings: UiPolicy = policy(
    constraintList('SOME_UNKNOWN_PROP', 'HAS_PART', ['A', 'B', 'C']),
    ['$.duties: Duties are currently unsupported.'],
  );

  export const unrestricted: UiPolicy = policy({
    type: 'EMPTY',
  });
}
