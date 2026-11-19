import type { ReactNode } from 'react';
import { badge, card } from '@/shared/ui';

/**
 * One elected leader: office label, name, optional role line and contact links. Home and the
 * Government page share it so the two can never drift apart.
 */
export function LeaderCard({
  office,
  name,
  role,
  children,
}: {
  office: string;
  name: string;
  role?: string;
  children?: ReactNode;
}) {
  return (
    <div className={card}>
      <span className={`${badge} mb-xs`}>{office}</span>
      <h3 className="text-xl font-bold">{name}</h3>
      {role && <p className="mb-xs text-sm text-text-light">{role}</p>}
      {children}
    </div>
  );
}
