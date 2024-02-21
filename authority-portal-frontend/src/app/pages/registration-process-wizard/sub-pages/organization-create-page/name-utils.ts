export const buildFullName = (...arr: (string | null | undefined)[]) =>
  arr
    .map((it) => it?.trim())
    .filter((it) => !!it)
    .join(' ');
