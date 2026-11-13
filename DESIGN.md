# Design direction

This file records the design decisions already built into the site, so new work follows them.
It was transcribed from the code (`src/app/globals.css`, `src/shared/ui.ts`), not invented.
Edit it freely: the owners of the project decide the direction, this file only writes it down.

## Read

A provincial services portal for residents, mostly on phones. Civic and calm.

Dial: ENERGY 1 / RHYTHM 2 / MOTION 1

## Palette

- **Primary:** `#0032a0` (dark `#002170`). Buttons, links, the one solid hero band, the focus ring on light surfaces.
- **Neutrals:** white `#ffffff`, tint `#f8f9fa`, text `#1a1a1a`, secondary text `#666666`.
- **Accent:** `#f77f00`, used sparingly (the footer cost figure, install banner button). Never as a focus ring on white (about 2.6:1).
- **Status:** danger `#d62828` (emergency bar), success `#06a77d`, info `#0077be`. Used for real state only.

## Type

Inter (variable, self-hosted). Reason: it is already bundled, covers the Latin diacritics that Filipino and Cebuano need, and stays legible at small sizes on low-end phones.
Headings use fluid sizes (`text-display`, `text-title`, `text-heading`) with tighter tracking as size grows.

## Shape and depth

- One radius (`--radius-base`, 8px) for cards, buttons and inputs.
- Full pills are only for tappable chips. Static labels use `badge` (small radius).
- Cards are outlined, not shadowed. Shadow marks something that floats: the sticky header, popovers, dialogs.
- No gradients. The home hero is a solid primary band; inner pages use a light header.

## Layout

- Home has three zones: do something (search, services), what is new (Facebook, news), about Bukidnon (facts, weather, history, leadership).
- Tint a section to group related content, not to alternate colours.
- Project and volunteer information lives in the footer, not in a pop-up or a home section.

## Motion

- One ease: `cubic-bezier(0.23, 1, 0.32, 1)`. UI transitions are 150 to 220ms.
- Press feedback is `scale(0.97)` on buttons and chips.
- Nothing loops on its own. Loading placeholders may pulse while data loads.
- Reduced motion is respected globally.

## Identity

Civic and plain. No decorative motif has been chosen. If the owners want one drawn from Bukidnon's own visual culture, it should come from, and be confirmed by, the communities it represents.

## Rules of thumb

- Every number shown has a source. Empty is better than invented.
- Every control does something. No dead links.
- Every string goes through the translation files (en, fil, ceb).
