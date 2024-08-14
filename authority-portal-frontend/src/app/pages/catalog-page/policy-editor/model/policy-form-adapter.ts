import {UiPolicyLiteral} from '@sovity.de/authority-portal-client';
import {format} from 'date-fns-tz';
import {filterNonNull} from '../../../../core/utils/array-utils';

export interface PolicyFormAdapter<T> {
  displayText: (value: UiPolicyLiteral) => string | null;
}

const readSingleStringLiteral = (literal: UiPolicyLiteral): string | null => {
  if (literal.type === 'STRING') {
    return literal.value ?? null;
  } else if (literal.type === 'STRING_LIST') {
    return literal.valueList?.length ? literal.valueList[0] : null;
  }
  return null;
};

const readArrayLiteral = (literal: UiPolicyLiteral): string[] => {
  if (literal.type === 'STRING') {
    return filterNonNull([literal.value]);
  } else if (literal.type === 'STRING_LIST') {
    return literal.valueList ?? [];
  }
  return [];
};

const readJsonLiteral = (literal: UiPolicyLiteral): string => {
  if (literal.type === 'STRING') {
    return JSON.stringify(literal.value);
  } else if (literal.type === 'STRING_LIST') {
    return JSON.stringify(literal.valueList);
  }
  return literal.value ?? 'null';
};

const stringLiteral = (value: string | null | undefined): UiPolicyLiteral => ({
  type: 'STRING',
  value: value ?? undefined,
});

export const localDateAdapter: PolicyFormAdapter<Date | null> = {
  displayText: (literal): string | null => {
    const value = readSingleStringLiteral(literal);
    try {
      if (!value) {
        return value;
      }
      return format(new Date(value), 'yyyy-MM-dd');
    } catch (e) {
      return '' + value;
    }
  },
};

export const stringAdapter: PolicyFormAdapter<string> = {
  displayText: (literal): string | null =>
    readSingleStringLiteral(literal) ?? '',
};

export const stringArrayOrCommaJoinedAdapter: PolicyFormAdapter<string[]> = {
  displayText: (literal): string | null => readArrayLiteral(literal).join(', '),
};

export const jsonAdapter: PolicyFormAdapter<string> = {
  displayText: (literal) => readJsonLiteral(literal),
};
