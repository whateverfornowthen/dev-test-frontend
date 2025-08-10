import { buildIsoDateFromParts, splitIsoDate } from '../../../main/helpers/dateHelper';

test('buildIsoDateFromParts returns ISO yyyy-mm-dd', () => {
  expect(buildIsoDateFromParts('1','2','2025')).toBe('2025-02-01');
});

test('returns undefined on bad parts', () => {
  expect(buildIsoDateFromParts('31','13','2025')).toBeUndefined();
  expect(buildIsoDateFromParts('','','2025')).toBeUndefined();
});

test('splitIsoDate splits valid ISO', () => {
  expect(splitIsoDate('2025-09-10')).toEqual({ day: '10', month: '09', year: '2025' });
});
