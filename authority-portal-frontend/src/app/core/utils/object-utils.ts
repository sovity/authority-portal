export type Patcher<T> = (value: T) => Partial<T>;

export function patchObj<T>(obj: T, patcher: Patcher<T>): T {
  return {...obj, ...patcher(obj)};
}
