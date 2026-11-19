import { ordinances, parseRecords, resolutions } from '@/features/legislative/legislativeData';

const parse = (ordinancesList: unknown[]) =>
  parseRecords({ ordinances: ordinancesList }, 'ordinances.json', 'ordinances', 'ordinanceNo');

describe('parseRecords', () => {
  it('accepts the (empty) ordinances.json and resolutions.json', () => {
    expect(ordinances).toEqual([]);
    expect(resolutions).toEqual([]);
  });

  it('sorts newest first, then by natural number order', () => {
    const list = parse([
      { ordinanceNo: '2024-2', title: 'A', sessionDate: '2024-01-01' },
      { ordinanceNo: '2025-9', title: 'B', sessionDate: '2025-03-01' },
      { ordinanceNo: '2025-10', title: 'C', sessionDate: '2025-03-01' },
    ]);
    expect(list.map((r) => r.number)).toEqual(['2025-10', '2025-9', '2024-2']);
  });

  it('rejects malformed records', () => {
    expect(() => parse([{ ordinanceNo: '1', title: '', sessionDate: '2025-01-01' }])).toThrow(
      /title/
    );
    expect(() => parse([{ ordinanceNo: '1', title: 'T', sessionDate: 'Jan 1' }])).toThrow(
      /sessionDate/
    );
    expect(() => parse([{ title: 'T', sessionDate: '2025-01-01' }])).toThrow(/ordinanceNo/);
    expect(() => parseRecords({}, 'ordinances.json', 'ordinances', 'ordinanceNo')).toThrow(/array/);
  });
});
