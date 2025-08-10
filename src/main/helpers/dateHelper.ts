export function buildIsoDateFromParts(day?: string, month?: string, year?: string): string | undefined {
  if (!day || !month || !year) {return undefined;}

  const dd = day.padStart(2, '0');
  const mm = month.padStart(2, '0');

  const dayNum = Number(dd), monthNum = Number(mm), yearNum = Number(year);
  if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) {return undefined;}

  return `${yearNum}-${mm}-${dd}`;
}

export function splitIsoDate(iso?: string) {
  if (!iso) {return { day: undefined, month: undefined, year: undefined };}

  const parts = iso.split('-');
  if (parts.length !== 3) {return { day: undefined, month: undefined, year: undefined };}

  const [year, month, day] = parts;
  if (!year || !month || !day) {return { day: undefined, month: undefined, year: undefined };}

  return { day, month, year };
}
