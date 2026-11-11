import raw from '@/content/data/officials.json';
import { isDistrict, type District } from '@/features/statistics/statisticsData';
import { check, isObj, isText, list, parseSources, type Obj, type Source } from '@/shared/validate';

export interface Officials {
  term: string;
  last_verified: string;
  sources: Source[];
  governor: { name: string; title: string };
  vice_governor: { name: string; title: string; role?: string };
  board_members: { name: string; district: District }[];
  ex_officio: { id: 'abc' | 'pcl' | 'sk' | 'ipmr'; name: string; seat: string }[];
  representatives: { name: string; district: District }[];
}

const F = 'officials.json';
const SEATS = ['abc', 'pcl', 'sk', 'ipmr'];

function people(data: Obj, key: string, rule: (p: Obj) => boolean, needs: string) {
  list(data, F, key).forEach((p, i) => {
    check(isText(p.name), `${F}: ${key}[${i}].name must be a non-empty string`);
    check(rule(p), `${F}: ${key}[${i}] ${needs}`);
  });
}

export function parseOfficials(data: unknown): Officials {
  check(isObj(data), `${F}: must be an object`);
  check(
    isText(data.term) && isText(data.last_verified),
    `${F}: "term" and "last_verified" are required`
  );
  for (const key of ['governor', 'vice_governor']) {
    const p = data[key];
    check(isObj(p) && isText(p.name) && isText(p.title), `${F}: "${key}" needs a name and a title`);
  }
  const byDistrict = (p: Obj) => isDistrict(p.district);
  people(data, 'board_members', byDistrict, 'needs a district of 1 to 4');
  people(data, 'representatives', byDistrict, 'needs a district of 1 to 4');
  people(
    data,
    'ex_officio',
    (p) => SEATS.includes(p.id as string) && isText(p.seat),
    `needs an id (${SEATS.join(', ')}) and a seat`
  );
  parseSources(data, F);
  return data as unknown as Officials;
}

export const officials = parseOfficials(raw);
