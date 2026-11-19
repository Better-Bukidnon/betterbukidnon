/**
 * Shared class strings for the whole site. One card, one button family, one section rhythm,
 * so a page only chooses *which* piece it needs (spec §4.5 consistency pass).
 */

/** Page-width column. */
export const container = 'mx-auto max-w-site px-sm';
/** Vertical rhythm for home-style sections: tighter on phones, roomier from md. */
export const sectionPad = 'py-lg md:py-xl';

/** Static card: an outline, no shadow. Shadow is kept for things that float (header, popovers). */
export const card = 'rounded-base border border-black/10 bg-bg p-md';
/** A card that is one big link. Border colour answers hover; background answers the press. */
export const cardLink = `${card} block text-text no-underline transition-[border-color,background-color] duration-150 ease-out hover:border-primary active:bg-bg-alt`;

const buttonBase =
  'inline-flex min-h-11 items-center justify-center gap-xs rounded-base px-md font-semibold no-underline transition-[background-color,transform] duration-150 ease-out active:scale-[0.97]';
export const buttonPrimary = `${buttonBase} bg-primary text-white hover:bg-primary-dark`;
export const buttonOutline = `${buttonBase} border-2 border-primary text-primary hover:bg-primary/5`;
/** For solid brand-coloured surfaces such as the home hero. */
export const buttonOnDark = `${buttonBase} bg-white text-primary hover:bg-bg-alt`;
export const buttonOutlineOnDark = `${buttonBase} border-2 border-white text-white hover:bg-white/10`;

/** A real status or category label. Static labels are square-ish; full pills are for tappable chips. */
export const badge =
  'inline-flex items-center gap-1 rounded-sm bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary';
/** A tappable chip (suggested searches, filters). */
export const chip =
  'inline-flex min-h-11 items-center rounded-full bg-primary/10 px-3 font-medium text-text no-underline transition-colors duration-150 ease-out hover:bg-primary/20 active:scale-[0.97]';

/** Inner-page section (the page supplies its own background band when it wants one). */
export const section = 'mx-auto max-w-site px-sm py-lg';
export const sectionTitle = 'mb-md flex items-center gap-xs text-2xl font-semibold';
/** Wide tables scroll horizontally inside this wrapper on mobile. */
export const tableWrap = 'overflow-x-auto rounded-base border border-black/10';
export const table = 'w-full border-collapse bg-bg text-left text-sm';
export const th = 'border-b border-black/10 bg-bg-alt px-sm py-xs font-semibold';
export const td = 'border-b border-black/5 px-sm py-xs';
/** Row-header cell that stays visible while a wide table scrolls sideways on mobile. */
export const stickyTh = 'sticky left-0 border-b border-black/5 bg-bg px-sm py-xs font-semibold';
