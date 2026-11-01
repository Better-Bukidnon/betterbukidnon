'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

function isMobileNav(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 1024px)').matches;
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const scrollYRef = useRef(0);
  const isAnimatingRef = useRef(false);

  const lockBodyScroll = useCallback(() => {
    scrollYRef.current = window.scrollY;
    document.body.classList.add('mobile-menu-open');
    document.body.style.top = `-${scrollYRef.current}px`;
  }, []);

  const unlockBodyScroll = useCallback(() => {
    document.body.classList.remove('mobile-menu-open');
    document.body.style.top = '';
    window.scrollTo(0, scrollYRef.current);
  }, []);

  const closeMenu = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setMobileMenuOpen(false);
    setOpenDropdown(null);
    unlockBodyScroll();
    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 320);
  }, [unlockBodyScroll]);

  const toggleDropdown = useCallback((index: number, e: React.MouseEvent) => {
    if (isMobileNav()) {
      e.preventDefault();
      setOpenDropdown((prev) => (prev === index ? null : index));
    }
  }, []);

  // Close menu on route change
  useEffect(() => {
    isAnimatingRef.current = false;
    closeMenu();
  }, [pathname, closeMenu]);

  // Cleanup body scroll lock on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('mobile-menu-open');
      document.body.style.top = '';
    };
  }, []);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        navRef.current &&
        !navRef.current.contains(target) &&
        toggleRef.current &&
        !toggleRef.current.contains(target)
      ) {
        closeMenu();
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [mobileMenuOpen, closeMenu]);

  // Escape key to close
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape' && mobileMenuOpen) {
        closeMenu();
        toggleRef.current?.focus();
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen, closeMenu]);

  // Close mobile menu on resize to desktop (debounced)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function handleResize() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!isMobileNav() && mobileMenuOpen) {
          isAnimatingRef.current = false;
          closeMenu();
        }
      }, 150);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileMenuOpen, closeMenu]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="logo-container">
          <a href="/">
            <img
              src="/assets/images/logo/better-bukidnon-logo.svg"
              alt="Better Bukidnon Logo"
              className="logo-img"
            />
          </a>
        </div>

        <nav
          ref={navRef}
          className={`main-nav ${mobileMenuOpen ? 'active' : ''}`}
          aria-label="Main Navigation"
        >
          <ul>
            <li>
              <a href="/" className={pathname === '/' ? 'active' : ''}>
                {t('nav-home')}
              </a>
            </li>
            <li className={`has-dropdown ${openDropdown === 0 ? 'dropdown-open' : ''}`}>
              <a
                href="/services"
                aria-haspopup="true"
                aria-expanded={openDropdown === 0 ? 'true' : 'false'}
                onClick={(e) => toggleDropdown(0, e)}
              >
                {t('nav-services')}
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a href="/services/certificates">{t('dropdown-certificates')}</a>
                </li>
                <li>
                  <a href="/services/business">{t('dropdown-business')}</a>
                </li>
                <li>
                  <a href="/services/tax-payments">{t('dropdown-tax-payments')}</a>
                </li>
                <li>
                  <a href="/services/social-services">{t('dropdown-social-services')}</a>
                </li>
                <li>
                  <a href="/services/health">{t('dropdown-health')}</a>
                </li>
                <li>
                  <a href="/services/agriculture">{t('dropdown-agriculture')}</a>
                </li>
                <li>
                  <a href="/services/infrastructure">{t('dropdown-infrastructure')}</a>
                </li>
                <li>
                  <a href="/services/education">{t('dropdown-education')}</a>
                </li>
                <li>
                  <a href="/services/public-safety">{t('dropdown-public-safety')}</a>
                </li>
                <li>
                  <a href="/services/environment">{t('dropdown-environment')}</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="/government">{t('nav-government')}</a>
            </li>
            <li>
              <a href="/statistics">{t('nav-statistics')}</a>
            </li>
            <li className={`has-dropdown ${openDropdown === 1 ? 'dropdown-open' : ''}`}>
              <a
                href="/legislative"
                aria-haspopup="true"
                aria-expanded={openDropdown === 1 ? 'true' : 'false'}
                onClick={(e) => toggleDropdown(1, e)}
              >
                {t('nav-legislative')}
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a href="/legislative/ordinance-framework">{t('dropdown-ordinance-framework')}</a>
                </li>
                <li>
                  <a href="/legislative/resolution-framework">
                    {t('dropdown-resolution-framework')}
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <a href="/budget">{t('nav-transparency')}</a>
            </li>
            <li>
              <a href="/contact">{t('nav-contact')}</a>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          <div className="lang-selector">
            <button
              type="button"
              className={`btn btn-secondary btn-sm lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
              aria-label="Switch to English"
            >
              EN
            </button>
            <button
              type="button"
              className={`btn btn-secondary btn-sm lang-btn ${language === 'fil' ? 'active' : ''}`}
              onClick={() => setLanguage('fil')}
              aria-label="Switch to Filipino"
            >
              FIL
            </button>
            <button
              type="button"
              className={`btn btn-secondary btn-sm lang-btn ${language === 'ceb' ? 'active' : ''}`}
              onClick={() => setLanguage('ceb')}
              aria-label="Switch to Cebuano (Binisaya)"
            >
              CEB
            </button>
          </div>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="mobile-menu-toggle btn btn-secondary"
          onClick={() => {
            if (isAnimatingRef.current) return;
            if (mobileMenuOpen) {
              closeMenu();
            } else {
              isAnimatingRef.current = true;
              setMobileMenuOpen(true);
              lockBodyScroll();
              setTimeout(() => {
                isAnimatingRef.current = false;
              }, 320);
            }
          }}
          aria-label="Toggle Navigation"
          aria-expanded={mobileMenuOpen ? 'true' : 'false'}
        >
          <i className={`bi ${mobileMenuOpen ? 'bi-x-lg' : 'bi-list'}`} aria-hidden="true"></i>
        </button>
      </div>
    </header>
  );
}
