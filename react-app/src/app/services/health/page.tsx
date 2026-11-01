'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function HealthPage() {
  const { t } = useLanguage();

  return (
    <>
      <div className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href="/">{t('nav-home')}</a>
          <span>/</span>
          <a href="/services">{t('nav-services')}</a>
          <span>/</span>
          <span aria-current="page">{t('health-page-title')}</span>
        </nav>
      </div>

      <section className="page-header">
        <div className="container">
          <div className="page-header-content">
            <span className="page-header-badge">
              <i className="bi bi-heart-pulse-fill"></i>
              <span>{t('health-page-badge')}</span>
            </span>
            <h1>{t('health-page-title')}</h1>
            <p className="page-header-desc">{t('health-page-desc')}</p>
          </div>
        </div>
      </section>

      {/* Provincial Health Office */}
      <section className="section section-compact bg-alt">
        <div className="container">
          <h2 className="section-title">
            <i className="bi bi-building"></i>
            <span>{t('health-section-pho')}</span>
          </h2>
          <div className="health-mho-card">
            <div className="health-mho-content">
              <h3>{t('health-pho-title')}</h3>
              <p>{t('health-pho-desc')}</p>
              <div className="health-mho-services">
                <span>
                  <i className="bi bi-telephone"></i>
                  <span>
                    {t('health-label-phone')}: <a href="tel:+63888135631">(088) 813-5631</a>
                  </span>
                </span>
                <span>
                  <i className="bi bi-geo-alt"></i>
                  <span>
                    {t('health-label-address')}: {t('health-address-value')}
                  </span>
                </span>
                <span>
                  <i className="bi bi-clock"></i>
                  <span>
                    {t('health-label-hours')}: {t('health-hours-value')}
                  </span>
                </span>
                <span>
                  <i className="bi bi-exclamation-triangle"></i>
                  <span>
                    {t('health-emergency-title')}: {t('health-emergency-desc')}{' '}
                    <a href="tel:911">911</a>
                  </span>
                </span>
              </div>
              <p>{t('health-gathering')}</p>
              <p>
                <a href="/service-details/provincial-health-office" className="btn btn-primary">
                  {t('health-details-link')} <i className="bi bi-arrow-right"></i>
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
