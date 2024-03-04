export function toMinutes(seconds: number): number {
  return seconds / 60;
}

export function toHours(seconds: number): number {
  return toMinutes(seconds) / 60;
}

export function toDays(seconds: number): number {
  return toHours(seconds) / 24;
}

export function humanizeDuration(seconds: number): string {
  const days = toDays(seconds);
  if (days >= 1) {
    return `${days.toFixed(0)} ${days === 1 ? 'day' : 'days'}`;
  }

  const hours = toHours(seconds);
  if (hours >= 1) {
    return `${hours.toFixed(0)} ${hours === 1 ? 'hour' : 'hours'}`;
  }

  const minutes = toMinutes(seconds);
  if (minutes >= 1) {
    return `${minutes.toFixed(0)} ${minutes === 1 ? 'minute' : 'minutes'}`;
  }

  return `${seconds.toFixed(0)} ${seconds === 1 ? 'second' : 'seconds'}`;
}
