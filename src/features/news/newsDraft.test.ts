import { emptyDraft, slugify, toJson, uniqueId, validate } from '@/features/news/newsDraft';

const draft = {
  ...emptyDraft('2026-03-10'),
  title: 'Road closure: Sayre Hwy',
  category: 'Advisory',
  summary: 'Detour via X.',
};

describe('news editor drafts', () => {
  it('derives a unique id from the title', () => {
    expect(slugify('Road closure: Sayre Hwy!')).toBe('road-closure-sayre-hwy');
    expect(uniqueId('a', ['a', 'a-2'])).toBe('a-3');
    expect(uniqueId('', [])).toBe('update');
  });

  it('turns a valid draft into the item the site validator accepts', () => {
    const { item, errors } = validate(draft, []);
    expect(errors).toEqual({});
    expect(item).toMatchObject({ id: 'road-closure-sayre-hwy', badge: 'info', date: '2026-03-10' });
    expect(item).not.toHaveProperty('url');
  });

  it('flags limits, bad urls and duplicate ids', () => {
    const { item, errors } = validate(
      { ...draft, title: 'x'.repeat(121), summary: 'y'.repeat(301), url: 'javascript:alert(1)' },
      ['xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx']
    );
    expect(item).toBeUndefined();
    expect(Object.keys(errors).sort()).toEqual(['id', 'summary', 'title', 'url']);
  });

  it('writes news.json newest first', () => {
    const a = validate({ ...draft, id: 'a', date: '2026-01-01' }, []).item!;
    const b = validate({ ...draft, id: 'b', date: '2026-02-01' }, []).item!;
    expect(JSON.parse(toJson([a, b])).news.map((n: { id: string }) => n.id)).toEqual(['b', 'a']);
  });
});
