export function kebabCaseToSentenceCase(input: string): string {
  return input
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
