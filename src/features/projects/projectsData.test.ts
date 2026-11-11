import raw from '@/content/data/projects.json';
import { parseProjects } from '@/features/projects/projectsData';

const valid = raw.projects[0];

describe('parseProjects', () => {
  it('accepts the shipped projects.json', () => {
    expect(parseProjects(raw).length).toBe(raw.projects.length);
  });

  it.each([
    ['missing list', {}, /must be an array/],
    ['empty name', { projects: [{ ...valid, name: ' ' }] }, /projects\[0\]\.name/],
    ['http url', { projects: [{ ...valid, url: 'http://x.org' }] }, /url must be an https URL/],
    ['javascript url', { projects: [{ ...valid, url: 'javascript:alert(1)' }] }, /url/],
    ['bad repo', { projects: [{ ...valid, repos: [{ name: 'x' }] }] }, /repos/],
  ])('rejects %s', (_, data, message) => {
    expect(() => parseProjects(data)).toThrow(message);
  });
});
