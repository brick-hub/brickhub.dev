const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export function timeAgo(date: Date): string {
  const nowUtc = new Date().getTime();
  const dateUtc = date.getTime();

  const minutesAgo = dateDiffInMinutes(dateUtc, nowUtc);
  if (minutesAgo < 60) return rtf.format(-minutesAgo, "minutes");

  const daysAgo = dateDiffInDays(dateUtc, nowUtc);
  if (daysAgo < 30) return rtf.format(-daysAgo, "days");

  const monthsAgo = dateDiffInMonths(dateUtc, nowUtc);
  if (monthsAgo < 12) return rtf.format(-monthsAgo, "months");

  const yearsAgo = dateDiffInYears(-dateUtc, nowUtc);
  return rtf.format(yearsAgo, "years");
}

function dateDiffInMinutes(a: number, b: number): number {
  const millisecondsPerMinute = 1000 * 60;
  return Math.floor((b - a) / millisecondsPerMinute);
}

function dateDiffInDays(a: number, b: number): number {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((b - a) / millisecondsPerDay);
}

function dateDiffInMonths(a: number, b: number): number {
  const millisecondsPerMonth = (1000 * 60 * 60 * 24 * 365) / 12;
  return Math.floor((b - a) / millisecondsPerMonth);
}

function dateDiffInYears(a: number, b: number): number {
  const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365;
  return Math.floor((b - a) / millisecondsPerYear);
}
