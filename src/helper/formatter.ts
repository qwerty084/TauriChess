export function dateFormatter(timestamp: number | Date) {
  return new Intl.DateTimeFormat().format(timestamp);
}
