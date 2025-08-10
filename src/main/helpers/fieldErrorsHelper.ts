export function extractFieldErrors(err: any): Record<string, string> | undefined {
  const status = err?.response?.status;
  const errors = err?.response?.data?.errors;
  if (status === 400 && Array.isArray(errors)) {
    const map: Record<string, string> = {};
    for (const e of errors) {map[e.field] = e.message;}
    return map;
  }
  return undefined;
}
