'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, List, XLg } from 'react-bootstrap-icons';
import { chromeDictionary } from '@/features/i18n/chromeDictionary';
import { useT } from '@/features/i18n/useT';
import { LanguageMenu } from '@/features/layout/LanguageMenu';
import { NAV, isActive, isCurrent, type NavLink } from '@/features/layout/navigation';

export function Header() {
  const pathname = usePathname();
  const t = useT(chromeDictionary);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeAll = () => {
    setOpenDropdown(null);
    setMenuOpen(false);
  };
  const label = (link: NavLink) =>
    typeof link.label === 'string' ? t(link.label) : link.label.text;

  // Escape and clicks outside close whatever is open.
  useEffect(() => {
    if (!menuOpen && !openDropdown) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      // Focus inside what is about to hide would drop to <body>: hand it to the control that
      // opened it (the menu toggle on mobile, the submenu's chevron on desktop).
      const focused = document.activeElement;
      if (focused && navRef.current?.contains(focused)) {
        const submenu = focused.closest('ul[id]');
        const opener =
          menuOpen || !submenu
            ? toggleRef.current
            : navRef.current.querySelector<HTMLElement>(`[aria-controls="${submenu.id}"]`);
        opener?.focus();
      }
      closeAll();
    };
    const onClick = (e: MouseEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) closeAll();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, [menuOpen, openDropdown]);

  return (
    // Sticky, so it floats over scrolling content: the one place a shadow marks real elevation.
    <header ref={headerRef} className="sticky top-0 z-40 bg-bg shadow-sm">
      <div className="mx-auto flex max-w-site items-center gap-sm px-sm py-xs">
        {/* Client-side navigation keeps this component mounted, so close the menu here. */}
        <Link href="/" className="mr-auto shrink-0" onClick={closeAll}>
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, unoptimized images */}
          <img
            src="/assets/images/logo/better-bukidnon-logo.svg"
            alt="Better Bukidnon Logo"
            width={180}
            height={48}
            className="h-12 w-auto"
          />
        </Link>

        <nav
          ref={navRef}
          id="main-nav"
          aria-label={t('nav-main-label')}
          // Desktop nav from xl: eight items plus the language menu do not fit at lg.
          className={`${menuOpen ? 'block' : 'hidden'} absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-black/10 bg-bg shadow-md xl:static xl:block xl:max-h-none xl:overflow-visible xl:border-0 xl:shadow-none`}
        >
          <ul className="flex flex-col p-xs xl:flex-row xl:items-center xl:gap-0.5 xl:p-0">
            {NAV.map((item) => {
              const active = isActive(item, pathname);
              const open = openDropdown === item.href;
              const submenuId = `submenu${item.href.replaceAll('/', '-')}`;
              const baseClass =
                'flex min-h-11 items-center rounded-base px-3 text-[0.9375rem] font-medium whitespace-nowrap no-underline transition-colors duration-200 xl:px-2.5';
              const tone = active ? 'text-primary' : 'text-text';
              // Submenu rows get their own hover background; top-level items get the animated underline.
              const linkClass = `${baseClass} hover:bg-bg-alt hover:text-primary ${tone}`;
              const topClass = `${baseClass} group-hover/row:text-primary ${tone}`;
              return (
                <li key={item.href} className="group relative">
                  <div
                    className={`group/row relative flex items-center rounded-base hover:bg-bg-alt xl:hover:bg-transparent xl:after:pointer-events-none xl:after:absolute xl:after:inset-x-2.5 xl:after:bottom-1 xl:after:h-0.5 xl:after:origin-left xl:after:rounded-full xl:after:bg-primary xl:after:transition-transform xl:after:duration-200 xl:after:content-[''] xl:hover:after:scale-x-100 ${
                      active ? 'xl:after:scale-x-100' : 'xl:after:scale-x-0'
                    }`}
                  >
                    <a
                      href={item.href}
                      className={`${topClass} grow ${active ? 'font-semibold' : ''}`}
                      aria-current={active ? 'page' : undefined}
                    >
                      {label(item)}
                    </a>
                    {item.children && (
                      <button
                        type="button"
                        className="flex size-11 items-center justify-center rounded-base text-text transition-colors group-hover/row:text-primary xl:-ml-2 xl:h-11 xl:w-6 xl:rounded-none xl:pr-1"
                        aria-expanded={open}
                        aria-controls={submenuId}
                        aria-label={t('nav-submenu', { label: label(item) })}
                        onClick={() => setOpenDropdown(open ? null : item.href)}
                      >
                        <ChevronDown
                          aria-hidden
                          className={`size-3 transition-transform duration-200 ${open ? 'rotate-180' : 'xl:group-hover/row:rotate-180'}`}
                        />
                      </button>
                    )}
                  </div>
                  {item.children && (
                    <ul
                      id={submenuId}
                      // Desktop: always rendered, faded and slid in on hover or when opened by the chevron.
                      className={`${open ? 'block' : 'hidden'} pl-sm xl:invisible xl:absolute xl:top-full xl:left-0 xl:z-50 xl:block xl:min-w-56 xl:translate-y-2 xl:rounded-base xl:border xl:border-black/10 xl:bg-bg xl:p-xs xl:pl-xs xl:opacity-0 xl:shadow-md xl:transition-[opacity,transform,visibility] xl:duration-200 xl:ease-out xl:group-hover:visible xl:group-hover:translate-y-0 xl:group-hover:opacity-100 ${
                        open ? 'xl:visible xl:translate-y-0 xl:opacity-100' : ''
                      }`}
                    >
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <a
                            href={child.href}
                            className={`${linkClass} text-sm ${isCurrent(child, pathname) ? 'text-primary' : ''}`}
                            aria-current={isCurrent(child, pathname) ? 'page' : undefined}
                            {...(child.external
                              ? { target: '_blank', rel: 'noopener noreferrer' }
                              : {})}
                          >
                            {label(child)}
                            {child.external && (
                              <span className="sr-only"> {t('nav-opens-new-tab')}</span>
                            )}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <LanguageMenu />

        <button
          ref={toggleRef}
          type="button"
          className="flex size-11 items-center justify-center rounded-base bg-secondary text-white transition-[background-color,transform] duration-150 ease-out hover:bg-primary-dark active:scale-[0.97] xl:hidden"
          aria-label={t('nav-toggle')}
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <XLg aria-hidden /> : <List aria-hidden className="size-6" />}
        </button>
      </div>
    </header>
  );
}
