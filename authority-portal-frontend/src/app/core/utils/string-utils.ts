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

export function kebabCaseToSentenceCase(input: string): string {
  return input
    .split('-')
    .map((w) => {
      return w.toLowerCase() === 'and'
        ? w
        : w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(' ');
}

export function trimmedOrNull(s?: string | null): string | null {
  const trimmed = s?.trim();
  return trimmed ? trimmed : null;
}

export function everythingBefore(separator: string, s: string): string {
  const index = s.indexOf(separator);
  return index === -1 ? s : s.substring(0, index);
}

export function everythingAfter(separator: string, s: string): string {
  const index = s.indexOf(separator);
  return index === -1 ? '' : s.substring(index + separator.length);
}

export function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function inferArticle(input: string) {
  const first = input.charAt(0);
  return ['a', 'e', 'i', 'o', 'u'].includes(first) ? 'an' : 'a';
}
