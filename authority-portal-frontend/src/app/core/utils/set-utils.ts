export const isEqualSets = <T>(first: Set<T>, other: Set<T>): boolean => {
  return (
    first.size == other.size && [...first].every((value) => other.has(value))
  );
};
