import raw from '@/content/data/projects.json';

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  repos: { name: string; url: string }[];
  type: string;
  category: string;
  status: string;
  icon: string;
}

const isText = (v: unknown): v is string => typeof v === 'string' && v.trim() !== '';
const isHttps = (v: unknown) => isText(v) && /^https:\/\//.test(v);

/** Throws at build time, so a malformed projects.json never ships a broken nav or page. */
export function parseProjects(data: unknown): Project[] {
  const list = (data as { projects?: unknown })?.projects;
  if (!Array.isArray(list)) throw new Error('projects.json: "projects" must be an array');
  return list.map((p, i) => {
    const where = `projects.json: projects[${i}]`;
    for (const field of ['id', 'name', 'description', 'type', 'category', 'status', 'icon']) {
      if (!isText(p?.[field])) throw new Error(`${where}.${field} must be a non-empty string`);
    }
    if (!isHttps(p.url)) throw new Error(`${where}.url must be an https URL`);
    if (
      !Array.isArray(p.repos) ||
      !p.repos.every((r: unknown) => {
        const repo = r as { name?: unknown; url?: unknown };
        return isText(repo?.name) && isHttps(repo?.url);
      })
    ) {
      throw new Error(`${where}.repos must be a list of { name, url } with https URLs`);
    }
    return p as Project;
  });
}

export const projects = parseProjects(raw);
