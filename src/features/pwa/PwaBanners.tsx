'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Download, XLg } from 'react-bootstrap-icons';
import { chromeDictionary } from '@/features/i18n/chromeDictionary';
import { useT } from '@/features/i18n/useT';

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<unknown>;
}

const DISMISS_KEY = 'pwa-install-dismissed';

function Banner({
  children,
  onDismiss,
  label,
}: {
  children: ReactNode;
  onDismiss: () => void;
  label: string;
}) {
  return (
    <div
      role="status"
      data-surface="dark"
      className="fixed inset-x-sm bottom-sm z-50 mx-auto flex max-w-[32rem] items-center gap-sm rounded-base bg-primary-dark p-sm text-sm text-white shadow-md"
    >
      {children}
      <button
        type="button"
        onClick={onDismiss}
        aria-label={label}
        className="flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-white/15"
      >
        <XLg aria-hidden />
      </button>
    </div>
  );
}

const action =
  'min-h-11 shrink-0 rounded-base bg-accent px-md font-semibold text-text transition-[background-color,transform] duration-150 ease-out hover:bg-accent/90 active:scale-[0.97]';

/**
 * Registers /sw.js in production builds only, and shows the install and "new version" banners
 * with the same rules as fce5da9:assets/js/main.js.
 */
export function PwaBanners() {
  const t = useT(chromeDictionary);
  const [install, setInstall] = useState<InstallPromptEvent | null>(null);
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;

    const onPrompt = (e: Event) => {
      e.preventDefault();
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as { standalone?: boolean }).standalone;
      let dismissed = false;
      try {
        dismissed = !!sessionStorage.getItem(DISMISS_KEY);
      } catch {}
      if (!standalone && !dismissed) setInstall(e as InstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);

    let timer: ReturnType<typeof setInterval> | undefined;
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        timer = setInterval(() => reg.update(), 30 * 60_000);
        reg.addEventListener('updatefound', () => {
          const worker = reg.installing;
          worker?.addEventListener('statechange', () => {
            if (worker.state === 'installed' && navigator.serviceWorker.controller) {
              setWaiting(worker);
            }
          });
        });
      })
      .catch(() => {});

    // Reload only when a new worker replaces an old one; the first claim of an uncontrolled
    // page has nothing stale to refresh (and would tear down the volunteer dialog).
    const hadController = !!navigator.serviceWorker.controller;
    let refreshing = false;
    const onControllerChange = () => {
      if (!hadController || refreshing) return;
      refreshing = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
      clearInterval(timer);
    };
  }, []);

  if (waiting) {
    return (
      <Banner label={t('pwa-dismiss-update')} onDismiss={() => setWaiting(null)}>
        <span className="flex-1">{t('pwa-update')}</span>
        <button
          type="button"
          className={action}
          onClick={() => {
            waiting.postMessage({ type: 'SKIP_WAITING' });
            setWaiting(null);
          }}
        >
          {t('pwa-update-button')}
        </button>
      </Banner>
    );
  }

  if (install) {
    return (
      <Banner
        label={t('pwa-dismiss-install')}
        onDismiss={() => {
          try {
            sessionStorage.setItem(DISMISS_KEY, '1');
          } catch {}
          setInstall(null);
        }}
      >
        <Download aria-hidden className="size-5 shrink-0" />
        <span className="flex-1">{t('pwa-install')}</span>
        <button
          type="button"
          className={action}
          onClick={() => {
            install.prompt();
            install.userChoice.then(() => setInstall(null));
          }}
        >
          {t('pwa-install-button')}
        </button>
      </Banner>
    );
  }

  return null;
}
