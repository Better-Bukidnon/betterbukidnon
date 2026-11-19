import raw from '@/content/data/officials.json';
import { officials, parseOfficials } from '@/features/government/governmentData';

describe('parseOfficials', () => {
  it('accepts officials.json', () => {
    expect(officials.governor.name).toMatch(/Roque/);
    expect(officials.board_members).toHaveLength(10);
    expect(officials.ex_officio).toHaveLength(4);
    expect(officials.representatives).toHaveLength(4);
  });

  it('rejects malformed data with a clear message', () => {
    expect(() => parseOfficials({ ...raw, governor: { title: 'Governor' } })).toThrow(/governor/);
    expect(() => parseOfficials({ ...raw, board_members: [{ name: 'X', district: 5 }] })).toThrow(
      /board_members\[0\].*district/
    );
    expect(() =>
      parseOfficials({ ...raw, ex_officio: [{ id: 'zz', name: 'X', seat: 'S' }] })
    ).toThrow(/ex_officio/);
    expect(() =>
      parseOfficials({ ...raw, sources: [{ name: 'Bad', url: 'javascript:alert(1)' }] })
    ).toThrow(/http/);
    expect(() => parseOfficials(null)).toThrow(/officials\.json/);
  });
});
