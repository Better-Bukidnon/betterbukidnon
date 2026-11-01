'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import SearchAutocomplete from '@/components/SearchAutocomplete';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <>
      {/* Hero Section */}
      <section className="home-hero-v2">
        <div className="container">
          <div className="home-hero-v2-inner">
            <div className="home-hero-v2-text">
              <h1>{t('hero-welcome')}</h1>
              <p>{t('hero-subtitle')}</p>
              <div className="home-hero-v2-actions">
                <a href="/services" className="btn btn-primary">
                  {t('hero-browse-services')} <i className="bi bi-arrow-right"></i>
                </a>
                <a href="/contact" className="btn btn-outline">
                  {t('hero-contact-us')}
                </a>
              </div>
            </div>
            <div className="home-hero-v2-search">
              <div className="home-search-box">
                <h2>
                  <i className="bi bi-search"></i> {t('hero-find-service')}
                </h2>
                <form className="search-form" role="search" onSubmit={(e) => e.preventDefault()}>
                  <div className="search-input-wrapper">
                    <SearchAutocomplete placeholder={t('hero-search-placeholder')} />
                    <button type="submit" className="search-submit-btn" aria-label="Search">
                      <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </form>
                <div className="home-search-tags">
                  <span>{t('hero-popular')}</span>
                  <a href="/service-details/provincial-treasurer">{t('hero-real-property-tax')}</a>
                  <a href="/service-details/birth-certificate">{t('hero-birth-certificate')}</a>
                  <a href="/service-details/pswdo">{t('hero-social-assistance')}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who handles what */}
      <section className="appointment-cta-section" aria-labelledby="lgu-cta-heading">
        <div className="container">
          <div className="appointment-cta-inner">
            <div className="appointment-cta-animation" aria-hidden="true">
              <dotlottie-player
                src="/assets/animation/ramonloganjr-booking.json"
                background="transparent"
                speed="1"
                loop
                autoplay
              ></dotlottie-player>
            </div>
            <div className="appointment-cta-content">
              <h2 id="lgu-cta-heading" className="appointment-cta-heading">
                {t('home-lgu-cta-heading')}
              </h2>
              <p className="appointment-cta-subtitle">{t('home-lgu-cta-subtitle')}</p>
              <div className="appointment-cta-actions">
                <a
                  href="/government#lgus"
                  className="appointment-cta-btn appointment-cta-btn--primary"
                >
                  <i className="bi bi-geo-alt-fill" aria-hidden="true"></i>{' '}
                  <span>{t('home-lgu-cta-find')}</span>
                </a>
                <a href="/government" className="appointment-cta-btn appointment-cta-btn--outline">
                  <i className="bi bi-building" aria-hidden="true"></i>{' '}
                  <span>{t('home-lgu-cta-offices')}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="section">
        <div className="container">
          <div className="home-section-header">
            <h2>{t('section-popular')}</h2>
            <p>{t('popular-services-subtitle')}</p>
          </div>
          <div className="home-services-grid">
            <a href="/services/tax-payments" className="home-service-card">
              <div className="home-service-icon">
                <i className="bi bi-cash-coin"></i>
              </div>
              <div className="home-service-content">
                <h3>{t('service-tax')}</h3>
                <p>{t('service-tax-desc')}</p>
              </div>
              <i className="bi bi-arrow-right home-service-arrow"></i>
            </a>
            <a href="/services/social-services" className="home-service-card">
              <div className="home-service-icon">
                <i className="bi bi-people-fill"></i>
              </div>
              <div className="home-service-content">
                <h3>{t('service-social')}</h3>
                <p>{t('service-social-desc')}</p>
              </div>
              <i className="bi bi-arrow-right home-service-arrow"></i>
            </a>
            <a href="/services/health" className="home-service-card">
              <div className="home-service-icon">
                <i className="bi bi-heart-pulse-fill"></i>
              </div>
              <div className="home-service-content">
                <h3>{t('service-health')}</h3>
                <p>{t('service-health-desc')}</p>
              </div>
              <i className="bi bi-arrow-right home-service-arrow"></i>
            </a>
            <a href="/services/agriculture" className="home-service-card">
              <div className="home-service-icon">
                <i className="bi bi-flower2"></i>
              </div>
              <div className="home-service-content">
                <h3>{t('service-agriculture')}</h3>
                <p>{t('service-agriculture-desc')}</p>
              </div>
              <i className="bi bi-arrow-right home-service-arrow"></i>
            </a>
            <a href="/services/certificates" className="home-service-card">
              <div className="home-service-icon">
                <i className="bi bi-file-earmark-text-fill"></i>
              </div>
              <div className="home-service-content">
                <h3>{t('service-certificates')}</h3>
                <p>{t('service-certificates-desc')}</p>
              </div>
              <i className="bi bi-arrow-right home-service-arrow"></i>
            </a>
            <a href="/services" className="home-service-card home-service-card--all">
              <div className="home-service-icon">
                <i className="bi bi-grid-fill"></i>
              </div>
              <div className="home-service-content">
                <h3>{t('btn-view-all-services')}</h3>
                <p>{t('popular-browse-directory')}</p>
              </div>
              <i className="bi bi-arrow-right home-service-arrow"></i>
            </a>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="home-stats-v2">
        <div className="container">
          <div className="home-stats-v2-header">
            <h2>{t('stats-at-a-glance')}</h2>
            <a href="/statistics" className="home-section-link">
              {t('stats-view-statistics')} <i className="bi bi-arrow-right"></i>
            </a>
          </div>
          <div className="home-stats-v2-grid">
            <a href="/statistics" className="home-stat-card">
              <div className="home-stat-card-icon">
                <i className="bi bi-people-fill"></i>
              </div>
              <div className="home-stat-card-content">
                <span className="home-stat-card-value">1,601,902</span>
                <span className="home-stat-card-label">{t('stats-population-label')}</span>
                <span className="home-stat-card-source">{t('stats-population-source')}</span>
              </div>
            </a>
            <a href="/government#lgus" className="home-stat-card">
              <div className="home-stat-card-icon">
                <i className="bi bi-geo-alt-fill"></i>
              </div>
              <div className="home-stat-card-content">
                <span className="home-stat-card-value">464</span>
                <span className="home-stat-card-label">{t('stats-barangays-label')}</span>
                <span className="home-stat-card-source">{t('stats-barangays-source')}</span>
              </div>
            </a>
            <a href="/budget" className="home-stat-card">
              <div className="home-stat-card-icon">
                <i className="bi bi-award-fill"></i>
              </div>
              <div className="home-stat-card-content">
                <span className="home-stat-card-value">{t('stats-first-class')}</span>
                <span className="home-stat-card-label">{t('stats-province-label')}</span>
                <span className="home-stat-card-source">{t('stats-province-source')}</span>
              </div>
            </a>
            <a href="/statistics" className="home-stat-card">
              <div className="home-stat-card-icon">
                <i className="bi bi-rulers"></i>
              </div>
              <div className="home-stat-card-content">
                <span className="home-stat-card-value">10,498.59 km²</span>
                <span className="home-stat-card-label">{t('stats-land-area-label')}</span>
                <span className="home-stat-card-source">{t('stats-land-area-source')}</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Weather & Map */}
      <section className="section weather-map-section">
        <div className="container">
          <div className="home-stats-v2-header">
            <h2>{t('weather-map-title')}</h2>
          </div>
          <div className="weather-map-grid">
            <div className="weather-column">
              <div id="weather-container" aria-live="polite">
                <div
                  className="weather-widget"
                  role="region"
                  aria-label="Current weather in Malaybalay City"
                >
                  <div className="weather-current">
                    <div className="weather-current-icon">
                      <i className="bi bi-cloud-sun-fill"></i>
                    </div>
                    <div className="weather-current-info">
                      <div className="weather-current-temp">--°C</div>
                      <div className="weather-current-condition">{t('weather-mainly-clear')}</div>
                      <div className="weather-current-location">
                        <i className="bi bi-geo-alt"></i> {t('weather-location')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="map-column">
              <div className="map-card">
                <div
                  id="map-container"
                  role="application"
                  aria-label="Interactive map of Bukidnon"
                  data-map-loaded="iframe"
                >
                  <iframe
                    src="https://www.openstreetmap.org/export/embed.html?bbox=124.55%2C7.35%2C125.65%2C8.65&layer=mapnik&marker=8.1575%2C125.1278"
                    className="map-iframe"
                    title="Map of Bukidnon"
                    aria-label="OpenStreetMap of Bukidnon with a marker on the Provincial Capitol in Malaybalay City"
                    loading="lazy"
                  ></iframe>
                </div>
                <p className="map-attribution">
                  <i className="bi bi-geo-alt" aria-hidden="true"></i>{' '}
                  <span>{t('home-capitol-address')}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brief History of Bukidnon */}
      <section className="section history-section">
        <div className="container">
          <div className="home-stats-v2-header">
            <h2>
              <i className="bi bi-book" aria-hidden="true"></i> {t('history-title')}
            </h2>
          </div>
          <div className="history-content">
            <div className="history-timeline">
              <div className="timeline-item" data-year="pre-colonial">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <span className="timeline-year">{t('history-precolonial-label')}</span>
                  <p>{t('history-precolonial')}</p>
                </div>
              </div>
              <div className="timeline-item" data-year="1850">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <span className="timeline-year">1850s</span>
                  <p>{t('history-1850s')}</p>
                </div>
              </div>
              <div className="timeline-item" data-year="1907">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <span className="timeline-year">1907</span>
                  <p>{t('history-1907')}</p>
                </div>
              </div>
              <div className="timeline-item" data-year="1917">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <span className="timeline-year">1917</span>
                  <p>{t('history-1917')}</p>
                </div>
              </div>
              <div className="timeline-item" data-year="1977">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <span className="timeline-year">1977</span>
                  <p>{t('history-1977')}</p>
                </div>
              </div>
              <div className="timeline-item" data-year="1998">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <span className="timeline-year">1998–2001</span>
                  <p>{t('history-cityhood')}</p>
                </div>
              </div>
              <div className="timeline-item" data-year="2012">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <span className="timeline-year">2012</span>
                  <p>{t('history-2012')}</p>
                </div>
              </div>
            </div>
            <div className="history-summary">
              <div className="history-card">
                <div className="history-card-icon">
                  <i className="bi bi-people-fill"></i>
                </div>
                <div className="history-card-content">
                  <h4>{t('history-card-tribes-title')}</h4>
                  <p>{t('history-card-tribes')}</p>
                </div>
              </div>
              <div className="history-card">
                <div className="history-card-icon">
                  <i className="bi bi-triangle-fill"></i>
                </div>
                <div className="history-card-content">
                  <h4>{t('history-card-highlands-title')}</h4>
                  <p>{t('history-card-highlands')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
          .history-section {
            background: linear-gradient(180deg, var(--color-bg-alt) 0%, var(--color-bg) 100%);
          }
          .history-section .home-stats-v2-header h2 {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .history-section .home-stats-v2-header h2 i {
            color: var(--color-primary);
          }
          .history-content {
            display: grid;
            grid-template-columns: 1fr 340px;
            gap: 32px;
            align-items: start;
          }
          .history-timeline {
            position: relative;
            padding-left: 28px;
          }
          .history-timeline::before {
            content: '';
            position: absolute;
            left: 6px;
            top: 8px;
            bottom: 8px;
            width: 2px;
            background: linear-gradient(
              180deg,
              var(--color-primary) 0%,
              rgba(0, 50, 160, 0.2) 100%
            );
            border-radius: 2px;
          }
          .timeline-item {
            position: relative;
            padding-bottom: 20px;
            opacity: 0;
            animation: fadeInUp 0.5s ease forwards;
          }
          .timeline-item:nth-child(1) {
            animation-delay: 0.1s;
          }
          .timeline-item:nth-child(2) {
            animation-delay: 0.2s;
          }
          .timeline-item:nth-child(3) {
            animation-delay: 0.3s;
          }
          .timeline-item:nth-child(4) {
            animation-delay: 0.4s;
          }
          .timeline-item:nth-child(5) {
            animation-delay: 0.5s;
          }
          .timeline-item:nth-child(6) {
            animation-delay: 0.6s;
          }
          .timeline-item:nth-child(7) {
            animation-delay: 0.7s;
          }
          .timeline-item:last-child {
            padding-bottom: 0;
          }
          .timeline-marker {
            position: absolute;
            left: -28px;
            top: 4px;
            width: 14px;
            height: 14px;
            background: var(--color-bg);
            border: 3px solid var(--color-primary);
            border-radius: 50%;
            transition: all 0.3s ease;
            z-index: 1;
          }
          .timeline-item:hover .timeline-marker {
            background: var(--color-primary);
            transform: scale(1.2);
            box-shadow: 0 0 0 4px rgba(0, 50, 160, 0.15);
          }
          .timeline-content {
            background: var(--color-bg);
            border: 1px solid rgba(0, 0, 0, 0.06);
            border-radius: 10px;
            padding: 16px 18px;
            transition: all 0.3s ease;
          }
          .timeline-item:hover .timeline-content {
            border-color: var(--color-primary);
            box-shadow: 0 4px 16px rgba(0, 50, 160, 0.1);
            transform: translateX(4px);
          }
          .timeline-year {
            display: inline-block;
            background: var(--color-primary);
            color: white;
            font-size: 0.75rem;
            font-weight: 700;
            padding: 3px 10px;
            border-radius: 20px;
            margin-bottom: 8px;
          }
          .timeline-content p {
            font-size: 0.875rem;
            color: var(--color-text);
            margin: 0;
            line-height: 1.6;
          }
          .timeline-content p strong {
            color: var(--color-primary);
          }
          .timeline-content p em {
            font-style: italic;
            color: var(--color-text-light);
          }
          .history-summary {
            display: flex;
            flex-direction: column;
            gap: 16px;
            position: sticky;
            top: 100px;
          }
          .history-card {
            background: var(--color-bg);
            border: 1px solid rgba(0, 0, 0, 0.06);
            border-radius: 12px;
            padding: 20px;
            display: flex;
            gap: 14px;
            align-items: flex-start;
            transition: all 0.3s ease;
          }
          .history-card:hover {
            border-color: var(--color-primary);
            box-shadow: 0 4px 16px rgba(0, 50, 160, 0.1);
            transform: translateY(-2px);
          }
          .history-card-icon {
            width: 44px;
            height: 44px;
            background: linear-gradient(
              135deg,
              var(--color-primary) 0%,
              var(--color-secondary) 100%
            );
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          .history-card-icon i {
            color: white;
            font-size: 1.25rem;
          }
          .history-card-content h4 {
            font-size: 0.9375rem;
            font-weight: 600;
            color: var(--color-text);
            margin: 0 0 6px 0;
          }
          .history-card-content p {
            font-size: 0.8125rem;
            color: var(--color-text-light);
            margin: 0;
            line-height: 1.5;
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(16px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @media (max-width: 900px) {
            .history-content {
              grid-template-columns: 1fr;
            }
            .history-summary {
              position: static;
              flex-direction: row;
              flex-wrap: wrap;
            }
            .history-card {
              flex: 1 1 280px;
            }
          }
          @media (max-width: 575px) {
            .history-summary {
              flex-direction: column;
            }
            .history-card {
              flex: 1 1 100%;
            }
          }
        `}</style>
      </section>

      {/* Latest Updates */}
      <section className="section">
        <div className="container">
          <div className="home-section-header">
            <h2>{t('section-updates')}</h2>
          </div>
          <div className="home-news-grid">
            <article className="home-news-card">
              <div className="home-news-meta">
                <span className="home-news-badge home-news-badge--info">
                  <i className="bi bi-facebook" aria-hidden="true"></i> {t('updates-eyebrow')}
                </span>
              </div>
              <p>{t('updates-desc')}</p>
              <p>
                <a
                  href="https://www.facebook.com/lgubukidnon"
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-facebook" aria-hidden="true"></i> {t('updates-cta')}
                </a>
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Provincial Leadership */}
      <section className="section home-leadership-section">
        <div className="container">
          <div className="home-section-header">
            <h2>{t('section-leadership')}</h2>
            <a href="/government/officials" className="home-section-link">
              <span>{t('btn-view-officials')}</span> <i className="bi bi-arrow-right"></i>
            </a>
          </div>
          <div className="home-leadership-grid">
            <div className="home-leader-card">
              <div className="home-leader-badge">{t('title-governor')}</div>
              <h3>Hon. Rogelio Neil P. Roque</h3>
              <div className="home-leader-contacts">
                <span>
                  <i className="bi bi-building" aria-hidden="true"></i> <span>{t('home-pgo')}</span>
                </span>
                <a href="tel:+63888132457">
                  <i className="bi bi-telephone"></i> (088) 813-2457
                </a>
              </div>
            </div>
            <div className="home-leader-card">
              <div className="home-leader-badge">{t('title-vice-governor')}</div>
              <h3>Hon. Clive D. Quiño</h3>
              <div className="home-leader-contacts">
                <span>
                  <i className="bi bi-bank" aria-hidden="true"></i>{' '}
                  <span>{t('home-sp-presiding-officer')}</span>
                </span>
                <a href="/legislative">
                  <i className="bi bi-arrow-right" aria-hidden="true"></i>{' '}
                  <span>{t('home-view-legislative')}</span>
                </a>
              </div>
            </div>
          </div>
          <p className="home-leadership-term">{t('home-leadership-term')}</p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section">
        <div className="container">
          <div className="home-section-header">
            <h2>{t('section-contact')}</h2>
            <a href="/contact" className="home-section-link">
              {t('btn-view-all')} <i className="bi bi-arrow-right"></i>
            </a>
          </div>
          <div className="home-contact-v2-grid">
            <a href="tel:+63888135741" className="home-contact-v2-card">
              <div className="home-contact-v2-icon">
                <i className="bi bi-telephone-fill"></i>
              </div>
              <div className="home-contact-v2-content">
                <h3>{t('contact-phone')}</h3>
                <p className="home-contact-v2-value">(088) 813-5741</p>
                <span className="home-contact-v2-note">{t('contact-hours')}</span>
              </div>
            </a>
            <a
              href="https://bukidnon.gov.ph/"
              className="home-contact-v2-card"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="home-contact-v2-icon">
                <i className="bi bi-globe2"></i>
              </div>
              <div className="home-contact-v2-content">
                <h3>{t('contact-website')}</h3>
                <p className="home-contact-v2-value">bukidnon.gov.ph</p>
                <span className="home-contact-v2-note">{t('contact-website-note')}</span>
              </div>
            </a>
            <div className="home-contact-v2-card">
              <div className="home-contact-v2-icon">
                <i className="bi bi-geo-alt-fill"></i>
              </div>
              <div className="home-contact-v2-content">
                <h3>{t('contact-address')}</h3>
                <p className="home-contact-v2-value">{t('contact-capitol-compound')}</p>
                <span className="home-contact-v2-note">{t('contact-capitol-city')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer CTA */}
      <section className="quiz-cta-section" aria-labelledby="volunteer-cta-heading">
        <div className="container">
          <div className="quiz-cta-inner">
            <div className="quiz-cta-animation" aria-hidden="true">
              <dotlottie-player
                src="/assets/animation/ramonloganjr-exam.json"
                background="transparent"
                speed="1"
                loop
                autoplay
              ></dotlottie-player>
            </div>
            <div className="quiz-cta-content">
              <h2 id="volunteer-cta-heading" className="quiz-cta-heading">
                {t('volunteer-heading')}
              </h2>
              <p className="quiz-cta-subtitle">{t('volunteer-subtitle')}</p>
              <p className="quiz-cta-description">{t('volunteer-description')}</p>
              <a
                href="https://github.com/DMNCDLPRT/betterbukidnon"
                className="quiz-cta-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-github" aria-hidden="true"></i> {t('volunteer-cta')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
