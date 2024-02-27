export const isEqualBy =
  <T>(key: keyof T) =>
  (a: T, b: T) =>
    a[key] === b[key];
