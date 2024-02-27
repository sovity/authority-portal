export function nonNull<T>(array: (T | null)[]): T[] {
  return array.filter((it) => it != null) as T[];
}
