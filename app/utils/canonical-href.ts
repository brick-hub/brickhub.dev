const baseUrl = "https://brickhub.dev";

export function canonicalHref(path?: string): string {
  return `${baseUrl}${path ?? ""}`;
}
