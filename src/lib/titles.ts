export function lessonTitle(slug: string): string {
  return deslug(slug.replace(/^\d+-/, ""));
}

export function tipTitle(slug: string): string {
  return deslug(slug);
}

export function lessonNumber(slug: string): number | null {
  const m = slug.match(/^(\d+)-/);
  return m ? parseInt(m[1], 10) : null;
}

function deslug(s: string): string {
  return s
    .split("-")
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}
