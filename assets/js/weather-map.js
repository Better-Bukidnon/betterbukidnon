/**
 * Weather & Map Section for Better Bukidnon Homepage
 * Displays real-time weather data and interactive map of Bukidnon
 * With robust fallback system to ensure content always renders
 */

// Wrap everything in IIFE to prevent redeclaration errors
(function () {
  'use strict';

  console.log('=== weather-map.js: Script loading started ===');

  // ============================================================================
  // Mock/Fallback Data - Always available static data
  // ============================================================================
  function getMockWeather() {
    const now = new Date();
    const currentHour = now.getHours();

    // Generate realistic hourly forecast based on current time
    const hourlyForecast = [];
    for (let i = 0; i < 6; i++) {
      const hour = (currentHour + i) % 24;
      const isPM = hour >= 12;
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const temp = 26 + Math.floor(Math.random() * 5); // 26-30°C range

      hourlyForecast.push({
        time: `${displayHour} ${isPM ? 'PM' : 'AM'}`,
        temperature: temp,
        icon: hour >= 6 && hour < 18 ? 'bi-cloud-sun-fill' : 'bi-moon-stars-fill',
      });
    }

    return {
      temperature: 29,
      humidity: 65,
      windSpeed: 12,
      weatherCode: 1,
      condition: 'Mainly clear',
      icon: 'bi-cloud-sun-fill',
      hourlyForecast: hourlyForecast,
      isFallback: true,
      timestamp: Date.now(),
    };
  }

  // ============================================================================
  // Utility: Check if running via file: protocol (no network access)
  // ============================================================================
  function isFileProtocol() {
    try {
      return window.location.protocol === 'file:';
    } catch (e) {
      return false;
    }
  }

  // ============================================================================
  // Weather Service - Handles fetching, caching, and providing weather data
  // ============================================================================
  const WeatherService = {
    CACHE_KEY: 'bukidnon_weather_cache',
    CACHE_TTL: 30 * 60 * 1000,
    API_URL: 'https://api.open-meteo.com/v1/forecast',
    COORDINATES: { lat: 8.1575, lon: 125.1278 },

    mapWeatherCode(code) {
      const mappings = {
        0: { condition: 'Clear sky', icon: 'bi-sun-fill' },
        1: { condition: 'Mainly clear', icon: 'bi-cloud-sun-fill' },
        2: { condition: 'Partly cloudy', icon: 'bi-cloud-sun-fill' },
        3: { condition: 'Overcast', icon: 'bi-clouds-fill' },
        45: { condition: 'Foggy', icon: 'bi-cloud-fog-fill' },
        48: { condition: 'Depositing rime fog', icon: 'bi-cloud-fog-fill' },
        51: { condition: 'Light drizzle', icon: 'bi-cloud-drizzle-fill' },
        53: { condition: 'Moderate drizzle', icon: 'bi-cloud-drizzle-fill' },
        55: { condition: 'Dense drizzle', icon: 'bi-cloud-drizzle-fill' },
        61: { condition: 'Slight rain', icon: 'bi-cloud-rain-fill' },
        63: { condition: 'Moderate rain', icon: 'bi-cloud-rain-fill' },
        65: { condition: 'Heavy rain', icon: 'bi-cloud-rain-heavy-fill' },
        80: { condition: 'Rain showers', icon: 'bi-cloud-rain-fill' },
        95: { condition: 'Thunderstorm', icon: 'bi-cloud-lightning-rain-fill' },
      };
      return mappings[code] || { condition: 'Partly cloudy', icon: 'bi-cloud-sun-fill' };
    },

    cacheWeather(data) {
      try {
        if (typeof localStorage === 'undefined') return;
        localStorage.setItem(
          this.CACHE_KEY,
          JSON.stringify({
            data: data,
            expiresAt: Date.now() + this.CACHE_TTL,
          })
        );
      } catch (e) {
        console.warn('Cache write failed:', e);
      }
    },

    getCachedWeather() {
      try {
        if (typeof localStorage === 'undefined') return null;
        const cached = localStorage.getItem(this.CACHE_KEY);
        if (!cached) return null;

        const entry = JSON.parse(cached);
        if (entry && entry.data && Date.now() < entry.expiresAt) {
          return entry.data;
        }

        // Clear expired cache
        localStorage.removeItem(this.CACHE_KEY);
      } catch (e) {
        console.warn('Cache read failed:', e);
        // Try to clear corrupted cache
        try {
          localStorage.removeItem(this.CACHE_KEY);
        } catch (ex) {
          /* ignore */
        }
      }
      return null;
    },

    async fetchWeather(lat, lon, options) {
      const targetLat = typeof lat === 'number' ? lat : this.COORDINATES.lat;
      const targetLon = typeof lon === 'number' ? lon : this.COORDINATES.lon;
      const isDefault =
        Math.abs(targetLat - this.COORDINATES.lat) < 0.0001 &&
        Math.abs(targetLon - this.COORDINATES.lon) < 0.0001;
      const externalSignal = options && options.signal ? options.signal : null;

      // If running via file: protocol (no CORS), use mock data only for default Malaybalay location
      if (isFileProtocol()) {
        console.log('Weather: File protocol detected');
        return isDefault
          ? getMockWeather()
          : { unavailable: true, isFallback: true, timestamp: Date.now() };
      }

      // Try cache first for default location
      if (isDefault) {
        try {
          const cached = this.getCachedWeather();
          if (cached) {
            return cached;
          }
        } catch (e) {
          console.warn('Weather: Cache check failed', e);
        }
      }

      // Try API fetch with timeout and optional caller AbortSignal
      const controller = new AbortController();
      const onExternalAbort = () => controller.abort();
      if (externalSignal) {
        if (externalSignal.aborted) {
          const abortErr = new Error('Weather request aborted');
          abortErr.name = 'AbortError';
          throw abortErr;
        }
        externalSignal.addEventListener('abort', onExternalAbort, { once: true });
      }
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const params = new URLSearchParams({
          latitude: targetLat,
          longitude: targetLon,
          current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
          hourly: 'temperature_2m,weather_code',
          timezone: 'Asia/Manila',
          forecast_days: 1,
        });

        const apiUrl = `${this.API_URL}?${params}`;
        const response = await fetch(apiUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const apiData = await response.json();
        const weatherData = this.transformApiResponse(apiData, isDefault);
        if (isDefault && !weatherData.unavailable) this.cacheWeather(weatherData);
        return weatherData;
      } catch (error) {
        clearTimeout(timeoutId);
        if (externalSignal && externalSignal.aborted) {
          const abortErr = new Error('Weather request aborted');
          abortErr.name = 'AbortError';
          throw abortErr;
        }
        console.warn('Weather: API fetch failed -', error.message);
        if (isDefault) {
          return getMockWeather();
        }
        return { unavailable: true, isFallback: true, timestamp: Date.now() };
      } finally {
        if (externalSignal) {
          externalSignal.removeEventListener('abort', onExternalAbort);
        }
      }
    },

    transformApiResponse(apiData, isDefault = true) {
      try {
        const current = apiData.current;
        const hourly = apiData.hourly;
        const { condition, icon } = this.mapWeatherCode(current.weather_code);
        const currentHour = new Date().getHours();
        const hourlyForecast = [];

        for (let i = 0; i < 6 && currentHour + i < hourly.time.length; i++) {
          const idx = currentHour + i;
          const { icon: fIcon } = this.mapWeatherCode(hourly.weather_code[idx]);
          const date = new Date(hourly.time[idx]);
          hourlyForecast.push({
            time: date.toLocaleTimeString('en-PH', { hour: 'numeric', hour12: true }),
            temperature: Math.round(hourly.temperature_2m[idx]),
            icon: fIcon,
          });
        }

        return {
          temperature: Math.round(current.temperature_2m),
          humidity: current.relative_humidity_2m,
          windSpeed: Math.round(current.wind_speed_10m),
          condition,
          icon,
          hourlyForecast,
          isFallback: false,
          timestamp: Date.now(),
        };
      } catch (e) {
        console.warn('Weather: Transform failed', e);
        return isDefault
          ? getMockWeather()
          : { unavailable: true, isFallback: true, timestamp: Date.now() };
      }
    },
  };

  // ============================================================================
  // Weather UI - Renders weather data into the DOM
  // ============================================================================
  const WeatherUI = {
    escapeHtml(str) {
      return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    },

    render(container, data, locationLabel, coords) {
      if (!container) return;
      const locText = locationLabel || 'Malaybalay City, Bukidnon';
      const safeLoc = this.escapeHtml(locText);

      if (data && data.unavailable) {
        this.renderUnavailable(container, locText, coords);
        return;
      }

      try {
        // Limit to 4 hours for minimal design
        const forecastHTML = data.hourlyForecast
          .slice(0, 4)
          .map(
            (h) => `
                <div class="weather-hour" role="listitem">
                    <span class="weather-hour-time">${h.time}</span>
                    <i class="bi ${h.icon}" aria-hidden="true"></i>
                    <span class="weather-hour-temp">${h.temperature}°</span>
                </div>
            `
          )
          .join('');

        const dataSourceBadge = data.isFallback
          ? '<span style="font-size:0.65rem;color:rgba(255,255,255,0.5);margin-left:4px;" title="Using fallback data">(Demo)</span>'
          : '<span style="font-size:0.65rem;color:#06a77d;margin-left:4px;" title="Live data from Open-Meteo API">●</span>';

        container.innerHTML = `
                <div class="weather-widget" role="region" aria-label="Current weather in ${safeLoc}">
                    <div class="weather-current">
                        <div class="weather-current-icon" aria-hidden="true">
                            <i class="bi ${data.icon}"></i>
                        </div>
                        <div class="weather-current-info">
                            <div class="weather-current-temp" aria-label="Temperature ${data.temperature} degrees Celsius">${data.temperature}°C</div>
                            <div class="weather-current-condition" aria-label="Condition: ${data.condition}">${data.condition}${dataSourceBadge}</div>
                            <div class="weather-current-location">
                                <i class="bi bi-geo-alt" aria-hidden="true"></i> ${safeLoc}
                            </div>
                        </div>
                    </div>
                    <div class="weather-stats" role="list" aria-label="Weather details">
                        <div class="weather-stat" role="listitem" aria-label="Humidity ${data.humidity} percent">
                            <i class="bi bi-droplet" aria-hidden="true"></i>
                            <span>${data.humidity}%</span>
                        </div>
                        <div class="weather-stat" role="listitem" aria-label="Wind speed ${data.windSpeed} kilometers per hour">
                            <i class="bi bi-wind" aria-hidden="true"></i>
                            <span>${data.windSpeed} km/h</span>
                        </div>
                    </div>
                    <div class="weather-hourly" role="list" aria-label="Hourly forecast">
                        ${forecastHTML}
                    </div>
                    <div class="weather-lgu-switcher">
                        <label for="weather-lgu-select">City / Municipality Weather</label>
                        <select id="weather-lgu-select" aria-label="Select city or municipality for live weather">
                            <option value="malaybalay-city">Malaybalay City (Capital)</option>
                        </select>
                    </div>
                </div>
            `;

        if (typeof window.populateWeatherLguSelect === 'function') {
          window.populateWeatherLguSelect(locText);
        }

        container.setAttribute('data-weather-loaded', 'true');
      } catch (e) {
        console.error('Weather: Render failed', e);
        this.renderError(container);
      }
    },

    renderUnavailable(container, locationLabel, coords) {
      if (!container) return;
      const locText = locationLabel || 'Selected locality';
      const safeLoc = this.escapeHtml(locText);
      container.innerHTML = `
            <div class="weather-widget weather-widget--unavailable" role="status" aria-live="polite" aria-label="Live weather unavailable for ${safeLoc}">
                <div class="weather-current">
                    <div class="weather-current-icon" aria-hidden="true">
                        <i class="bi bi-cloud-slash"></i>
                    </div>
                    <div class="weather-current-info">
                        <div class="weather-current-condition" style="font-weight:600;">Live weather unavailable</div>
                        <div class="weather-current-location">
                            <i class="bi bi-geo-alt" aria-hidden="true"></i> ${safeLoc}
                        </div>
                    </div>
                </div>
                <p style="font-size:0.8125rem;opacity:0.85;margin:0.5rem 0;">Real-time weather data could not be reached for this locality. Please try again shortly.</p>
                <div style="margin-bottom:0.75rem;">
                    <button type="button" class="btn btn-sm btn-primary weather-retry-btn" id="weather-locality-retry-btn">
                        <i class="bi bi-arrow-clockwise" aria-hidden="true"></i> Retry
                    </button>
                </div>
                <div class="weather-lgu-switcher">
                    <label for="weather-lgu-select">City / Municipality Weather</label>
                    <select id="weather-lgu-select" aria-label="Select city or municipality for live weather">
                        <option value="malaybalay-city">Malaybalay City (Capital)</option>
                    </select>
                </div>
            </div>
        `;
      if (typeof window.populateWeatherLguSelect === 'function') {
        window.populateWeatherLguSelect(locText);
      }
      const retryBtn = container.querySelector('#weather-locality-retry-btn');
      if (retryBtn) {
        retryBtn.addEventListener('click', () => {
          if (coords && typeof coords.lat === 'number' && typeof coords.lon === 'number' && typeof window.updateBukidnonWeather === 'function') {
            window.updateBukidnonWeather(coords.lat, coords.lon, locText);
          } else if (window.WeatherMapInit) {
            window.WeatherMapInit();
          }
        });
      }
      container.setAttribute('data-weather-loaded', 'unavailable');
    },

    renderLoading(container) {
      if (!container) return;
      container.innerHTML = `
            <div class="weather-loading" data-loading="true" aria-busy="true" aria-label="Loading weather data">
                <div class="weather-current">
                    <div class="skeleton-circle"></div>
                    <div class="weather-current-info">
                        <div class="skeleton-text skeleton-lg"></div>
                        <div class="skeleton-text skeleton-md" style="margin-top:8px;"></div>
                        <div class="skeleton-text skeleton-sm" style="margin-top:8px;"></div>
                    </div>
                </div>
                <div class="weather-stats">
                    <div class="skeleton-text skeleton-stat"></div>
                    <div class="skeleton-text skeleton-stat"></div>
                </div>
                <div class="weather-hourly">
                    <div class="skeleton-hour"></div>
                    <div class="skeleton-hour"></div>
                    <div class="skeleton-hour"></div>
                    <div class="skeleton-hour"></div>
                </div>
            </div>
        `;
    },

    renderError(container, retryFn) {
      if (!container) return;
      container.innerHTML = `
            <div class="weather-error" role="alert">
                <div class="weather-error-content">
                    <i class="bi bi-cloud-slash" aria-hidden="true"></i>
                    <p>Weather data unavailable</p>
                    <button type="button" class="btn btn-sm btn-primary weather-retry-btn" onclick="window.WeatherMapInit && window.WeatherMapInit()">
                        <i class="bi bi-arrow-clockwise" aria-hidden="true"></i> Retry
                    </button>
                </div>
            </div>
        `;
      container.setAttribute('data-weather-loaded', 'error');
    },
  };

  // ============================================================================
  // Map Component - Initializes and manages the Leaflet map
  // ============================================================================
  const MapComponent = {
    BUKIDNON_CENTER: [8.1575, 125.1278],
    DEFAULT_ZOOM: 14,
    map: null,

    init(containerId) {
      const container = document.getElementById(containerId);
      if (!container) {
        console.error('Map: Container not found');
        return null;
      }

      // If map already exists, just resize it
      if (this.map) {
        console.log('Map: Already initialized, resizing');
        this.map.invalidateSize();
        return this.map;
      }

      // If Leaflet is available, upgrade the container to an interactive map
      if (typeof L !== 'undefined') {
        console.log('Map: Leaflet available, upgrading to interactive map');
        return this.initLeaflet(container);
      }

      // Leaflet not available — the iframe embedded in the HTML stays visible.
      // Ensure the fallback iframe is present if the container is somehow empty.
      if (!container.querySelector('iframe')) {
        console.warn('Map: Leaflet unavailable and no iframe found, inserting fallback');
        this.renderTextFallback(container);
      } else {
        console.log('Map: Leaflet unavailable, keeping existing iframe');
      }
      return null;
    },

    renderLoading(container) {
      container.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;min-height:300px;background:#f5f5f5;">
                <i class="bi bi-map" style="font-size:2.5rem;color:#0032a0;opacity:0.4;"></i>
                <p style="color:#888;margin-top:0.5rem;font-size:0.875rem;">Loading map...</p>
            </div>
        `;
    },

    renderTextFallback(container) {
      // Use OpenStreetMap iframe embed as fallback - this always works
      container.innerHTML = `
            <iframe 
                width="100%" 
                height="300" 
                frameborder="0" 
                scrolling="no" 
                marginheight="0" 
                marginwidth="0" 
                src="https://www.openstreetmap.org/export/embed.html?bbox=124.55%2C7.35%2C125.65%2C8.65&layer=mapnik&marker=8.1575%2C125.1278"
                style="border:0;display:block;"
                title="Map of Bukidnon"
                loading="lazy">
            </iframe>
        `;
      container.setAttribute('data-map-loaded', 'iframe');
    },

    initLeaflet(container) {
      try {
        console.log('Map: Initializing Leaflet...');

        // Fix marker icon paths when Leaflet is loaded from a CDN — the auto-detection
        // of _iconUrl relative to the script URL is unreliable across CDN providers.
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        // Clear any existing content (removes the inline iframe when upgrading)
        container.innerHTML = '';

        // Create the map with keyboard navigation support
        this.map = L.map(container, {
          center: this.BUKIDNON_CENTER,
          zoom: this.DEFAULT_ZOOM,
          zoomSnap: 0.1,
          scrollWheelZoom: false,
          zoomControl: true,
          attributionControl: true,
          keyboard: true,
          keyboardPanDelta: 80,
        });

        if (this.map.attributionControl) {
          this.map.attributionControl.setPrefix(false);
        }

        // Add tile layer with CSP-block detection — some servers (e.g. cPanel hosts that inject
        // their own CSP alongside .htaccess) block tile.openstreetmap.org images even when
        // unpkg.com images (marker icons) load fine. If 3 tile errors fire before any tile
        // succeeds, the host is blocking tiles; fall back to the always-reliable OSM iframe embed.
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
          crossOrigin: false,
        });

        let tileLoadedOnce = false;
        let tileErrorCount = 0;

        tileLayer.on('tileload', () => {
          tileLoadedOnce = true;
        });

        tileLayer.on('tileerror', () => {
          if (!tileLoadedOnce) {
            tileErrorCount++;
            if (tileErrorCount >= 3) {
              console.warn(
                'Map: Tiles blocked (likely CSP or network), falling back to OSM embed iframe'
              );
              const map = this.map;
              this.map = null;
              if (map) map.remove();
              this.renderTextFallback(container);
            }
          }
        });

        tileLayer.addTo(this.map);

        // Add provincial overview & all 22 LGU markers
        this.map.setView([7.95, 125.02], 9);
        this.loadLguLayer();

        container.setAttribute('data-map-loaded', 'leaflet');

        // Force resize after a short delay
        setTimeout(() => {
          if (this.map) {
            this.map.invalidateSize();
            console.log('Map: Resize complete');
          }
        }, 100);

        // Another resize after tiles might have loaded
        setTimeout(() => {
          if (this.map) {
            this.map.invalidateSize();
          }
        }, 500);

        console.log('Map: Leaflet initialized successfully');
        return this.map;
      } catch (e) {
        console.error('Map: Leaflet initialization failed:', e);
        this.renderTextFallback(container);
        return null;
      }
    },

    loadLguLayer() {
      const infoPanel = document.getElementById('map-info-panel');
      const textAltList = document.getElementById('map-text-alt-list');
      const searchInput = document.getElementById('map-lgu-search');
      const filterSelect = document.getElementById('map-lgu-filter');
      const brgySelect = document.getElementById('map-brgy-select');
      const resetBtn = document.getElementById('map-reset-btn');

      let allLgus = [];
      let allBarangays = null;
      let bukidnonBounds = null;
      const markersBySlug = new Map();
      const layerGroup = L.layerGroup().addTo(this.map);

      if (this.map && this.map.createPane) {
        const maskPane = this.map.createPane('bukidnonMask');
        maskPane.style.zIndex = '350';
        maskPane.style.pointerEvents = 'none';
      }

      fetch('data/bukidnon-boundary.geojson')
        .then((r) => r.json())
        .then((geojson) => {
          const coords = geojson && geojson.geometry && geojson.geometry.coordinates && geojson.geometry.coordinates[0];
          if (!coords || !coords.length || !this.map) return;
          const ring = coords.map((c) => [c[1], c[0]]);
          const worldRing = [
            [-90, -180],
            [-90, 180],
            [90, 180],
            [90, -180],
          ];
          L.polygon([worldRing, ring], {
            pane: 'bukidnonMask',
            className: 'bb-map-outside-mask',
            fillColor: '#e2e8f0',
            fillOpacity: 0.68,
            stroke: false,
            interactive: false,
          }).addTo(this.map);

          const boundary = L.polygon(ring, {
            color: '#0032a0',
            weight: 2.5,
            opacity: 0.9,
            fill: false,
            interactive: false,
          }).addTo(this.map);

          bukidnonBounds = boundary.getBounds();
          this.map.fitBounds(bukidnonBounds, { padding: [12, 12] });
        })
        .catch((err) => {
          console.warn('Map: Could not load Bukidnon boundary GeoJSON', err);
        });

      function esc(s) {
        return String(s || '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      }

      function renderInfoPanel(lgu) {
        if (!infoPanel || !lgu) return;
        infoPanel.style.display = 'block';
        const sealHtml =
          lgu.seal && lgu.seal.path
            ? `<div class="bb-seal-frame bb-seal-frame--sm"><img src="${esc(lgu.seal.path)}" alt="${esc(lgu.name)} seal" loading="lazy" /></div>`
            : `<div class="bb-seal-frame bb-seal-frame--sm bb-seal-frame--fallback" aria-hidden="true"><i class="bi bi-shield-fill"></i></div>`;

        infoPanel.innerHTML = `
          <div class="bb-card-top">
            ${sealHtml}
            <div class="bb-card-heading">
              <h3 class="bb-card-title" style="margin-bottom:2px">${esc(lgu.name)}</h3>
              <p class="bb-card-subtitle">${esc(lgu.classification)} &middot; District ${esc(lgu.district)} &middot; ${lgu.barangay_count} Barangays &middot; Pop. (${esc(lgu.population.latest_year)}): ${Number(lgu.population.latest || 0).toLocaleString('en-US')}</p>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <a href="lgus/${encodeURIComponent(lgu.slug)}/" class="btn btn-primary btn-sm">View Profile</a>
              <a href="barangays/?lgu=${encodeURIComponent(lgu.slug)}" class="btn btn-secondary btn-sm">Barangays</a>
            </div>
          </div>
        `;
      }

      function populateBarangaysForLgu(lgu) {
        if (!brgySelect) return;
        brgySelect.disabled = true;
        brgySelect.innerHTML = '<option value="">Loading barangays...</option>';

        const loadPromise = allBarangays
          ? Promise.resolve(allBarangays)
          : fetch('data/barangays.json')
              .then((r) => r.json())
              .then((d) => {
                allBarangays = d.barangays || [];
                return allBarangays;
              });

        loadPromise
          .then((brgys) => {
            const list = brgys.filter((b) => b.lgu_slug === lgu.slug);
            brgySelect.innerHTML = `<option value="">Select barangay (${list.length})</option>`;
            list.forEach((b) => {
              const opt = document.createElement('option');
              opt.value = b.psgc_code;
              opt.textContent = b.name;
              brgySelect.appendChild(opt);
            });
            brgySelect.disabled = false;
          })
          .catch(() => {
            brgySelect.innerHTML = '<option value="">Unavailable</option>';
          });
      }

      let searchWeatherTimer = null;

      const selectLgu = (lgu) => {
        if (!lgu) return;
        if (searchWeatherTimer) {
          clearTimeout(searchWeatherTimer);
          searchWeatherTimer = null;
        }
        renderInfoPanel(lgu);
        populateBarangaysForLgu(lgu);
        if (this.map && lgu.coordinates && lgu.coordinates.lat && lgu.coordinates.lon) {
          this.map.setView([lgu.coordinates.lat, lgu.coordinates.lon], 12);
          const m = markersBySlug.get(lgu.slug);
          if (m) m.openPopup();
          if (typeof window.updateBukidnonWeather === 'function') {
            window.updateBukidnonWeather(lgu.coordinates.lat, lgu.coordinates.lon, `${lgu.name}, Bukidnon`);
          }
        }
      };

      const renderMarkers = () => {
        layerGroup.clearLayers();
        markersBySlug.clear();
        if (searchWeatherTimer) {
          clearTimeout(searchWeatherTimer);
          searchWeatherTimer = null;
        }
        const q = (searchInput ? searchInput.value : '').trim().toLowerCase();
        const flt = filterSelect ? filterSelect.value : 'all';

        const visible = allLgus.filter((lgu) => {
          if (flt === 'Component City' && lgu.classification !== 'Component City') return false;
          if (/^[1-4]$/.test(flt) && String(lgu.district) !== flt) return false;
          if (q && lgu.name.toLowerCase().indexOf(q) === -1) return false;
          return true;
        });

        visible.forEach((lgu) => {
          if (!lgu.coordinates || !lgu.coordinates.lat || !lgu.coordinates.lon) return;
          const isCity = lgu.classification === 'Component City';
          const isCapital = !!lgu.is_capital;
          const pinSize = isCapital ? 20 : isCity ? 18 : 14;
          const pinClass = isCapital
            ? 'bb-map-pin bb-map-pin--capital'
            : isCity
              ? 'bb-map-pin bb-map-pin--city'
              : 'bb-map-pin bb-map-pin--muni';
          const pinIcon = L.divIcon({
            className: 'bb-map-pin-wrapper',
            html: `<span class="${pinClass}" aria-hidden="true"></span>`,
            iconSize: [pinSize, pinSize],
            iconAnchor: [pinSize / 2, pinSize / 2],
            popupAnchor: [0, -pinSize / 2],
          });

          const marker = L.marker([lgu.coordinates.lat, lgu.coordinates.lon], {
            icon: pinIcon,
            title: lgu.name,
            alt: lgu.name,
            zIndexOffset: isCapital ? 200 : isCity ? 100 : 0,
          }).addTo(layerGroup);

          marker.bindTooltip(esc(lgu.name), {
            direction: 'top',
            offset: [0, -8],
            className: 'bb-map-tooltip',
          });

          marker.bindPopup(
            `<strong>${esc(lgu.name)}</strong><br>${esc(lgu.classification)} &middot; District ${esc(lgu.district)}<br>Barangays: ${lgu.barangay_count}<br><a href="lgus/${encodeURIComponent(lgu.slug)}/">View LGU Profile</a>`
          );
          marker.on('click', () => selectLgu(lgu));
          markersBySlug.set(lgu.slug, marker);
        });

        if (visible.length === 1 && q) {
          const single = visible[0];
          if (
            single.coordinates &&
            single.coordinates.lat &&
            single.coordinates.lon &&
            typeof window.updateBukidnonWeather === 'function'
          ) {
            searchWeatherTimer = setTimeout(() => {
              searchWeatherTimer = null;
              window.updateBukidnonWeather(
                single.coordinates.lat,
                single.coordinates.lon,
                `${single.name}, Bukidnon`
              );
            }, 350);
          }
        }
      };

      window.populateWeatherLguSelect = (activeLocationText) => {
        const wSelect = document.getElementById('weather-lgu-select');
        if (!wSelect || !allLgus.length) return;
        wSelect.innerHTML = allLgus
          .map((l) => {
            const isSelected = activeLocationText && activeLocationText.indexOf(l.name) === 0;
            return `<option value="${esc(l.slug)}"${isSelected ? ' selected' : ''}>${esc(l.name)}${l.is_capital ? ' (Capital)' : ''}</option>`;
          })
          .join('');
        wSelect.onchange = () => {
          const chosen = allLgus.find((l) => l.slug === wSelect.value);
          if (chosen) selectLgu(chosen);
        };
      };

      fetch('data/lgus.json')
        .then((r) => r.json())
        .then((data) => {
          allLgus = data.lgus || [];
          renderMarkers();
          window.populateWeatherLguSelect('Malaybalay City, Bukidnon');

          if (textAltList) {
            textAltList.innerHTML =
              '<ul style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:6px 12px">' +
              allLgus
                .map(
                  (l) =>
                    `<li><a href="lgus/${encodeURIComponent(l.slug)}/"><strong>${esc(l.name)}</strong></a> (${esc(l.classification)}, ${l.barangay_count} brgys)</li>`
                )
                .join('') +
              '</ul>';
          }

          if (searchInput) {
            searchInput.addEventListener('input', renderMarkers);
          }
          if (filterSelect) {
            filterSelect.addEventListener('change', renderMarkers);
          }
          if (brgySelect) {
            brgySelect.addEventListener('change', () => {
              if (brgySelect.value) {
                window.location.href = 'barangays/profile/?code=' + encodeURIComponent(brgySelect.value);
              }
            });
          }
          if (resetBtn) {
            resetBtn.addEventListener('click', () => {
              if (searchInput) searchInput.value = '';
              if (filterSelect) filterSelect.value = 'all';
              if (brgySelect) {
                brgySelect.innerHTML = '<option value="">Select LGU first</option>';
                brgySelect.disabled = true;
              }
              if (infoPanel) {
                infoPanel.innerHTML = '';
                infoPanel.style.display = 'none';
              }
              renderMarkers();
              if (this.map) {
                if (bukidnonBounds) {
                  this.map.fitBounds(bukidnonBounds, { padding: [12, 12] });
                } else {
                  this.map.setView([7.95, 125.02], 9);
                }
              }
              if (typeof window.updateBukidnonWeather === 'function') {
                window.updateBukidnonWeather(8.1575, 125.1278, 'Malaybalay City, Bukidnon');
              }
            });
          }
        })
        .catch((err) => {
          console.warn('Map: Could not load data/lgus.json, showing Capitol marker', err);
          const marker = L.marker(this.BUKIDNON_CENTER).addTo(this.map);
          marker.bindPopup('<strong>Bukidnon Provincial Capitol</strong><br>Malaybalay City 8700');
        });
    },
  };

  // ============================================================================
  // Main Initialization Function
  // ============================================================================
  async function WeatherMapInit() {
    console.log('Weather-Map: Initializing...');

    const weatherContainer = document.getElementById('weather-container');
    const mapContainer = document.getElementById('map-container');

    // WEATHER: Show loading, then fetch with AbortController & stale-response counter
    let activeWeatherRequestId = 0;
    let activeWeatherAbortController = null;

    window.updateBukidnonWeather = async function (lat, lon, locationLabel) {
      if (!weatherContainer) return;
      if (activeWeatherAbortController) {
        activeWeatherAbortController.abort();
      }
      const controller = new AbortController();
      activeWeatherAbortController = controller;
      const requestId = ++activeWeatherRequestId;
      const coords =
        typeof lat === 'number' && typeof lon === 'number' ? { lat, lon } : undefined;

      try {
        const data = await WeatherService.fetchWeather(lat, lon, {
          signal: controller.signal,
        });
        if (requestId !== activeWeatherRequestId) return;
        WeatherUI.render(weatherContainer, data, locationLabel, coords);
      } catch (error) {
        if (error && error.name === 'AbortError') return;
        if (requestId !== activeWeatherRequestId) return;
        console.error('Weather: Update failed', error);
        WeatherUI.renderUnavailable(weatherContainer, locationLabel, coords);
      }
    };

    if (weatherContainer) {
      try {
        // Show loading state first
        WeatherUI.renderLoading(weatherContainer);

        // Fetch initial default weather via the same request-guarded path
        await window.updateBukidnonWeather(
          WeatherService.COORDINATES.lat,
          WeatherService.COORDINATES.lon,
          'Malaybalay City, Bukidnon'
        );
      } catch (error) {
        console.error('Weather: Init failed', error);
        // Render mock data as last resort for default Malaybalay view
        WeatherUI.render(weatherContainer, getMockWeather());
      }
    }

    // MAP: Initialize
    if (mapContainer) {
      try {
        MapComponent.init('map-container');
      } catch (error) {
        console.error('Map: Init failed', error);
        MapComponent.renderTextFallback(mapContainer);
      }
    }
  }

  // Expose for retry button and failsafe
  window.WeatherMapInit = WeatherMapInit;
  console.log('=== weather-map.js: WeatherMapInit exposed to window ===');

  // ============================================================================
  // Auto-initialization
  // ============================================================================
  (function () {
    console.log('=== weather-map.js: Auto-init IIFE executing ===');
    console.log('Document readyState:', document.readyState);

    function init() {
      console.log('=== weather-map.js: Calling WeatherMapInit() ===');
      WeatherMapInit();
    }

    if (document.readyState === 'loading') {
      console.log('=== weather-map.js: Waiting for DOMContentLoaded ===');
      document.addEventListener('DOMContentLoaded', init);
    } else {
      console.log('=== weather-map.js: DOM already loaded, initializing immediately ===');
      init();
    }
  })();

  console.log('=== weather-map.js: Script loading completed ===');

  // Export for testing
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WeatherService, WeatherUI, MapComponent, getMockWeather };
  }
})(); // End of IIFE
