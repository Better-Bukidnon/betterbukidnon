import { useEffect, useRef, useState } from 'react'
import markerIcon2xUrl from 'leaflet/dist/images/marker-icon-2x.png?url'
import markerIconUrl from 'leaflet/dist/images/marker-icon.png?url'
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png?url'
import { Icon, type IconName } from '@/components/ui/icon'
import { GlanceHeader } from './home-ui'
import { m } from '@/paraglide/messages'
import { localizePath } from '@/lib/i18n'
import type { Barangay, Lgu } from '@/features/directories/data'
import { getLocale } from '@/paraglide/runtime'

// Provincial Capitol, Malaybalay City (same point as the legacy weather-map.js).
const CAPITOL: [number, number] = [8.1575, 125.1278]
const WEATHER_TTL = 15 * 60 * 1000
type WeatherLocation = { lat: number; lon: number; label: string }
const CAPITOL_LOCATION: WeatherLocation = {
  lat: CAPITOL[0],
  lon: CAPITOL[1],
  label: 'Malaybalay City, Bukidnon',
}
const OSM_EMBED =
  'https://www.openstreetmap.org/export/embed.html?bbox=124.55%2C7.35%2C125.65%2C8.65&layer=mapnik&marker=8.1575%2C125.1278'

// WMO weather codes, as mapped by the legacy weather-map.js.
const weatherCodes: Record<number, { condition: string; icon: IconName }> = {
  0: { condition: 'Clear sky', icon: 'sun-fill' },
  1: { condition: 'Mainly clear', icon: 'cloud-sun-fill' },
  2: { condition: 'Partly cloudy', icon: 'cloud-sun-fill' },
  3: { condition: 'Overcast', icon: 'clouds-fill' },
  45: { condition: 'Foggy', icon: 'cloud-fog-fill' },
  48: { condition: 'Depositing rime fog', icon: 'cloud-fog-fill' },
  51: { condition: 'Light drizzle', icon: 'cloud-drizzle-fill' },
  53: { condition: 'Moderate drizzle', icon: 'cloud-drizzle-fill' },
  55: { condition: 'Dense drizzle', icon: 'cloud-drizzle-fill' },
  61: { condition: 'Slight rain', icon: 'cloud-rain-fill' },
  63: { condition: 'Moderate rain', icon: 'cloud-rain-fill' },
  65: { condition: 'Heavy rain', icon: 'cloud-rain-heavy-fill' },
  80: { condition: 'Rain showers', icon: 'cloud-rain-fill' },
  95: { condition: 'Thunderstorm', icon: 'cloud-lightning-rain-fill' },
}
const describe = (code: number) =>
  weatherCodes[code] ?? { condition: 'Partly cloudy', icon: 'cloud-sun-fill' as IconName }

type Weather = {
  temperature: number
  humidity: number
  windSpeed: number
  code: number
  hourly: Array<{ time: string; temperature: number; code: number }>
}

type ForecastResponse = {
  current: {
    temperature_2m: number
    relative_humidity_2m: number
    weather_code: number
    wind_speed_10m: number
  }
  hourly: { time: string[]; temperature_2m: number[]; weather_code: number[] }
}

async function fetchWeather(location: WeatherLocation): Promise<Weather> {
  const cacheKey = `home_weather_${location.lat.toFixed(4)}_${location.lon.toFixed(4)}`
  try {
    const cached = JSON.parse(localStorage.getItem(cacheKey) ?? 'null') as {
      at: number
      data: Weather
    } | null
    if (cached && Date.now() - cached.at < WEATHER_TTL) return cached.data
  } catch {
    // Ignore unreadable cache entries and fetch fresh data.
  }
  const params = new URLSearchParams({
    latitude: String(location.lat),
    longitude: String(location.lon),
    current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
    hourly: 'temperature_2m,weather_code',
    timezone: 'Asia/Manila',
    forecast_days: '1',
  })
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
    signal: AbortSignal.timeout(10_000),
  })
  if (!response.ok) throw new Error(`Weather: HTTP ${response.status}`)
  const data = (await response.json()) as ForecastResponse
  // Times are in Asia/Manila ("2026-11-09T16:00"), so the hour is read straight from the string.
  const nowHour = Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Manila',
      hour: 'numeric',
      hourCycle: 'h23',
    }).format(new Date()),
  )
  const start = data.hourly.time.findIndex((time) => Number(time.slice(11, 13)) >= nowHour)
  const weather: Weather = {
    temperature: Math.round(data.current.temperature_2m),
    humidity: data.current.relative_humidity_2m,
    windSpeed: Math.round(data.current.wind_speed_10m),
    code: data.current.weather_code,
    hourly: data.hourly.time
      .slice(Math.max(start, 0), Math.max(start, 0) + 4)
      .map((time, index) => {
        const hour = Number(time.slice(11, 13))
        const i = Math.max(start, 0) + index
        return {
          time: `${hour % 12 || 12} ${hour < 12 ? 'am' : 'pm'}`,
          temperature: Math.round(data.hourly.temperature_2m[i] ?? 0),
          code: data.hourly.weather_code[i] ?? 0,
        }
      }),
  }
  try {
    localStorage.setItem(cacheKey, JSON.stringify({ at: Date.now(), data: weather }))
  } catch {
    // Shown either way; it is only fetched again on the next visit.
  }
  return weather
}

const card =
  'flex h-full flex-col rounded-2xl border border-black/6 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_2px_6px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.06)] max-sm:rounded-xl'

const shimmer =
  'animate-[skeleton-shimmer_1.5s_ease-in-out_infinite] bg-[linear-gradient(90deg,#f0f0f0_25%,#fafafa_50%,#f0f0f0_75%)] bg-size-[200%_100%]'

function WeatherCard({ location }: { location: WeatherLocation }) {
  const [state, setState] = useState<'loading' | 'error' | Weather>('loading')
  const [retry, setRetry] = useState(0)

  const load = () => setRetry((attempt) => attempt + 1)
  useEffect(() => {
    let current = true
    setState('loading')
    fetchWeather(location)
      .then((weather) => current && setState(weather))
      .catch(() => current && setState('error'))
    return () => {
      current = false
    }
  }, [location, retry])

  if (state === 'loading') {
    return (
      <div
        aria-busy="true"
        aria-label="Loading weather data"
        className="rounded-2xl border border-black/6 bg-white p-8 max-sm:p-6"
      >
        <div className="flex items-start gap-6 pb-6">
          <div className={`size-14 rounded-xl ${shimmer}`} />
          <div className="flex-1">
            <div className={`mb-2 h-10 w-25 rounded-md ${shimmer}`} />
            <div className={`mt-2 h-4 w-20 rounded-md ${shimmer}`} />
            <div className={`mt-2 h-3 w-30 rounded-md ${shimmer}`} />
          </div>
        </div>
        <div className="flex gap-6 border-y border-black/5 py-4">
          <div className={`h-4 w-17.5 rounded-md ${shimmer}`} />
          <div className={`h-4 w-17.5 rounded-md ${shimmer}`} />
        </div>
        <div className="mt-auto flex justify-between gap-1.5 pt-6">
          {[0, 1, 2, 3].map((n) => (
            <div key={n} className={`h-18 min-w-0 flex-1 rounded-[10px] ${shimmer}`} />
          ))}
        </div>
      </div>
    )
  }

  // Legacy showed made-up "(Demo)" weather when the API failed; show an honest error instead.
  if (state === 'error') {
    return (
      <div
        role="alert"
        className="flex min-h-70 items-center justify-center rounded-2xl border border-black/6 bg-white p-12"
      >
        <div className="text-center">
          <Icon name="cloud-slash" className="mb-4 text-[2.5rem] text-ink-light opacity-50" />
          <p className="mb-6 text-[0.875rem] text-ink-light">Weather data unavailable</p>
          <button
            type="button"
            onClick={load}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-site border-2 border-transparent bg-primary px-4 py-2 text-[0.8125rem] font-semibold text-white hover:bg-primary-dark"
          >
            <Icon name="arrow-clockwise" /> Retry
          </button>
        </div>
      </div>
    )
  }

  const current = describe(state.code)
  return (
    <div
      role="region"
      aria-label={`Current weather in ${location.label}`}
      className={`group p-8 max-sm:p-6 ${card}`}
    >
      <div className="flex items-start gap-6 pb-6">
        <div
          aria-hidden="true"
          className="text-[3rem] leading-none text-primary opacity-90 transition-transform duration-300 group-hover:scale-105 max-sm:text-[2.5rem]"
        >
          <Icon name={current.icon} />
        </div>
        <div className="flex-1">
          <div className="mb-1.5 text-[2.5rem] font-bold leading-none tracking-[-1px] text-ink max-sm:text-[2rem]">
            {state.temperature}°C
          </div>
          <div className="mb-1 text-[0.9375rem] font-medium text-ink max-sm:text-[0.875rem]">
            {current.condition}
            <span
              className="ml-1 text-[0.65rem] text-success"
              title="Live data from Open-Meteo API"
            >
              ●
            </span>
          </div>
          <div className="flex items-center gap-1 text-[0.75rem] text-ink-light">
            <Icon name="geo-alt" className="text-[0.6875rem] text-primary" /> {location.label}
          </div>
        </div>
      </div>
      <div
        role="list"
        aria-label="Weather details"
        className="flex gap-6 border-y border-black/5 py-4 max-sm:gap-4"
      >
        <div
          role="listitem"
          aria-label={`Humidity ${state.humidity} percent`}
          className="flex items-center gap-1.5 text-[0.8125rem] max-sm:text-[0.75rem]"
        >
          <Icon name="droplet" className="text-[0.875rem] text-primary opacity-80" />
          <span className="font-medium text-ink">{state.humidity}%</span>
        </div>
        <div
          role="listitem"
          aria-label={`Wind speed ${state.windSpeed} kilometers per hour`}
          className="flex items-center gap-1.5 text-[0.8125rem] max-sm:text-[0.75rem]"
        >
          <Icon name="wind" className="text-[0.875rem] text-primary opacity-80" />
          <span className="font-medium text-ink">{state.windSpeed} km/h</span>
        </div>
      </div>
      <div
        role="list"
        aria-label="Hourly forecast"
        className="mt-auto flex justify-between gap-1.5 pt-6 max-lg:justify-start max-lg:overflow-x-auto max-lg:pb-1"
      >
        {state.hourly.map((hour) => (
          <div
            key={hour.time}
            role="listitem"
            className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-[10px] bg-surface-alt px-2.5 py-2 transition-[background-color,transform] duration-200 hover:-translate-y-px hover:bg-primary/6 max-lg:min-w-16 max-lg:flex-none"
          >
            <span className="text-[0.625rem] font-medium uppercase tracking-[0.3px] text-ink-light">
              {hour.time}
            </span>
            <Icon name={describe(hour.code).icon} className="text-[1rem] text-primary opacity-85" />
            <span className="text-[0.8125rem] font-semibold text-ink">{hour.temperature}°</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CapitolMap({
  onLocationChange,
}: {
  onLocationChange: (location: WeatherLocation) => void
}) {
  const container = useRef<HTMLDivElement>(null)
  const mapRef = useRef<import('leaflet').Map | null>(null)
  const bounds = useRef<import('leaflet').LatLngBounds | null>(null)
  const markers = useRef(new Map<string, import('leaflet').Marker>())
  const barangaysPromise = useRef<Promise<Barangay[]> | null>(null)
  const barangaysRequestId = useRef(0)
  const barangaysLoadFailed = useRef(false)
  const selectedLguSlug = useRef<string | null>(null)
  const chooseLguRef = useRef<(lgu: Lgu, options?: { focusMap?: boolean }) => void>(() => {})
  const [lgus, setLgus] = useState<Lgu[]>([])
  const [interactive, setInteractive] = useState(false)
  const [query, setQuery] = useState('')
  const [district, setDistrict] = useState('all')
  const [selected, setSelected] = useState<Lgu>()
  const [selectedBarangays, setSelectedBarangays] = useState<Barangay[]>([])
  const [barangaysStatus, setBarangaysStatus] = useState<
    'idle' | 'loading' | 'ready' | 'unavailable'
  >('idle')
  const [barangayCode, setBarangayCode] = useState('')

  const loadBarangays = (lgu: Lgu) => {
    const requestId = ++barangaysRequestId.current
    barangaysLoadFailed.current = false
    setBarangaysStatus('loading')
    setSelectedBarangays([])

    if (!barangaysPromise.current) {
      barangaysPromise.current = fetch('/data/barangays.json')
        .then((response) => {
          if (!response.ok) throw new Error(`Barangays: HTTP ${response.status}`)
          return response.json() as Promise<{ barangays: Barangay[] }>
        })
        .then((data) => data.barangays)
        .catch((error: unknown) => {
          barangaysPromise.current = null
          throw error
        })
    }

    void barangaysPromise.current
      .then((barangays) => {
        if (requestId !== barangaysRequestId.current) return
        setSelectedBarangays(barangays.filter((barangay) => barangay.lgu_slug === lgu.slug))
        setBarangaysStatus('ready')
      })
      .catch(() => {
        if (requestId !== barangaysRequestId.current) return
        barangaysLoadFailed.current = true
        setBarangaysStatus('unavailable')
      })
  }

  const chooseLgu = (lgu: Lgu, options: { focusMap?: boolean } = {}) => {
    const selectionChanged = selectedLguSlug.current !== lgu.slug
    selectedLguSlug.current = lgu.slug
    if (selectionChanged || barangaysLoadFailed.current) {
      setSelected(lgu)
      setBarangayCode('')
      loadBarangays(lgu)
    }

    if (selectionChanged || options.focusMap) {
      mapRef.current?.setView([lgu.coordinates.lat, lgu.coordinates.lon], 12)
      markers.current.get(lgu.slug)?.openPopup()
      if (selectionChanged) {
        onLocationChange({
          lat: lgu.coordinates.lat,
          lon: lgu.coordinates.lon,
          label: `${lgu.name}, Bukidnon`,
        })
      }
    }
  }
  chooseLguRef.current = chooseLgu

  const reset = () => {
    barangaysRequestId.current += 1
    barangaysLoadFailed.current = false
    selectedLguSlug.current = null
    setQuery('')
    setDistrict('all')
    setSelected(undefined)
    setSelectedBarangays([])
    setBarangaysStatus('idle')
    setBarangayCode('')
    onLocationChange(CAPITOL_LOCATION)
    if (bounds.current?.isValid()) mapRef.current?.fitBounds(bounds.current, { padding: [12, 12] })
  }

  useEffect(() => {
    const element = container.current
    if (!element) return
    let map: import('leaflet').Map | undefined
    let cancelled = false

    void Promise.all([
      import('leaflet'),
      import('leaflet/dist/leaflet.css'),
      fetch('/data/lgus.json'),
      fetch('/data/bukidnon-boundary.geojson'),
    ])
      .then(async ([L, , lguResponse, boundaryResponse]) => {
        if (!lguResponse.ok || !boundaryResponse.ok) throw new Error('Could not load map data')
        const lguData = (await lguResponse.json()) as { lgus: Lgu[] }
        const boundaryData = (await boundaryResponse.json()) as GeoJSON.GeoJsonObject
        if (cancelled) return
        setLgus(lguData.lgus)
        setInteractive(true)
        map = L.map(element, {
          center: CAPITOL,
          zoom: 14,
          scrollWheelZoom: false,
          keyboard: true,
          keyboardPanDelta: 80,
        })
        let loaded = false
        let errors = 0
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        })
          .on('tileload', () => {
            loaded = true
          })
          .on('tileerror', () => {
            if (loaded || ++errors < 3) return
            map?.remove()
            map = undefined
            mapRef.current = null
            setInteractive(false)
          })
          .addTo(map)
        mapRef.current = map
        const capitolMarker = L.marker(CAPITOL, {
          icon: L.icon({
            iconUrl: markerIconUrl,
            iconRetinaUrl: markerIcon2xUrl,
            shadowUrl: markerShadowUrl,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          }),
        })
          .addTo(map)
          .bindPopup('<strong>Bukidnon Provincial Capitol</strong><br>Malaybalay City 8700')
        for (const lgu of lguData.lgus) {
          const isCapital = lgu.is_capital
          const isCity = lgu.classification === 'Component City'
          const size = isCapital ? 20 : isCity ? 18 : 14
          const pin = L.divIcon({
            className: 'bb-map-pin-wrapper',
            html: `<span class="bb-map-pin ${isCapital ? 'bb-map-pin--capital' : isCity ? 'bb-map-pin--city' : 'bb-map-pin--muni'}" aria-hidden="true"></span>`,
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
            popupAnchor: [0, -size / 2],
          })
          const lguMarker = L.marker([lgu.coordinates.lat, lgu.coordinates.lon], {
            icon: pin,
            title: lgu.name,
            alt: lgu.name,
            zIndexOffset: isCapital ? 200 : isCity ? 100 : 0,
          })
            .bindTooltip(lgu.name, {
              direction: 'top',
              offset: [0, -8],
              className: 'bb-map-tooltip',
            })
            .bindPopup(
              `<strong>${lgu.name}</strong><br>${lgu.classification} · District ${lgu.district}`,
            )
            .on('click', () => chooseLguRef.current(lgu, { focusMap: true }))
            .addTo(map)
          markers.current.set(lgu.slug, lguMarker)
        }
        const boundary = L.geoJSON(boundaryData, {
          style: { color: '#0032a0', weight: 2.5, opacity: 0.9, fill: false },
          interactive: false,
        }).addTo(map)
        bounds.current = boundary.getBounds()
        if (bounds.current.isValid()) map.fitBounds(bounds.current, { padding: [12, 12] })
        capitolMarker.on('click', () => {
          const capital = lguData.lgus.find((lgu) => lgu.is_capital)
          if (capital) chooseLguRef.current(capital, { focusMap: true })
        })
      })
      .catch((error: unknown) => {
        if (!cancelled) console.error('Could not initialize the Bukidnon map', error)
        map?.remove()
        map = undefined
        setInteractive(false)
      })

    return () => {
      cancelled = true
      map?.remove()
      mapRef.current = null
      markers.current.clear()
      bounds.current = null
    }
  }, [])

  useEffect(() => {
    const normalized = query.trim().toLocaleLowerCase()
    const visible: Lgu[] = []
    for (const lgu of lgus) {
      const marker = markers.current.get(lgu.slug)
      const matchesQuery = !normalized || lgu.name.toLocaleLowerCase().includes(normalized)
      const matchesDistrict =
        district === 'all' || String(lgu.district) === district || lgu.classification === district
      if (matchesQuery && matchesDistrict) {
        visible.push(lgu)
        if (marker && mapRef.current) marker.addTo(mapRef.current)
      } else marker?.remove()
    }
    if (normalized && visible.length === 1) chooseLguRef.current(visible[0]!)
  }, [district, lgus, query])

  return (
    <div className={`overflow-hidden ${card}`}>
      <div className="grid grid-cols-[1.4fr_1fr_1.2fr_auto] items-end gap-2.5 border-b border-black/6 bg-white px-4 py-3.5 max-[993px]:grid-cols-2 max-[640px]:grid-cols-1">
        <label className="grid min-w-0 gap-1 text-xs font-semibold text-ink-light">
          Find City / Municipality
          <input
            type="search"
            value={query}
            list="home-map-lgus"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search 22 LGUs..."
            className="min-h-10 rounded-site border border-black/15 px-3 text-sm font-normal"
          />
          <datalist id="home-map-lgus">
            {lgus.map((lgu) => (
              <option key={lgu.slug} value={lgu.name} />
            ))}
          </datalist>
        </label>
        <label className="grid min-w-0 gap-1 text-xs font-semibold text-ink-light">
          Filter
          <select
            value={district}
            onChange={(event) => setDistrict(event.target.value)}
            className="min-h-10 rounded-site border border-black/15 bg-white px-3 text-sm font-normal"
          >
            <option value="all">All 22 LGUs</option>
            <option value="Component City">Cities (2)</option>
            {[1, 2, 3, 4].map((number) => (
              <option key={number} value={String(number)}>
                {number}
                {number === 1 ? 'st' : number === 2 ? 'nd' : number === 3 ? 'rd' : 'th'} District
              </option>
            ))}
          </select>
        </label>
        <label className="grid min-w-0 gap-1 text-xs font-semibold text-ink-light">
          Barangay (by LGU)
          <select
            disabled={!selected || barangaysStatus !== 'ready'}
            value={barangayCode}
            onChange={(event) => {
              const barangay = selectedBarangays.find(
                (entry) => entry.psgc_code === event.target.value,
              )
              if (barangay && selected)
                window.location.assign(
                  localizePath(
                    `/barangays/${selected.slug}/${barangay.slug.split('/').at(-1)}`,
                    getLocale(),
                  ),
                )
              setBarangayCode(event.target.value)
            }}
            className="min-h-10 rounded-site border border-black/15 bg-white px-3 text-sm font-normal disabled:bg-surface-alt"
          >
            <option value="">
              {barangaysStatus === 'loading'
                ? 'Loading barangays...'
                : barangaysStatus === 'unavailable'
                  ? 'Unavailable'
                  : selected
                    ? `Select barangay (${selectedBarangays.length})`
                    : 'Select LGU first'}
            </option>
            {selectedBarangays.map((barangay) => (
              <option key={barangay.psgc_code} value={barangay.psgc_code}>
                {barangay.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-[38px] items-center justify-self-start whitespace-nowrap rounded-site border border-black/15 px-3.5 text-sm font-semibold text-ink hover:bg-surface-alt"
        >
          Reset map view
        </button>
      </div>
      <div
        role="application"
        aria-label="Interactive map of Bukidnon"
        // Legacy #map-container: flex: 1 from a 300px minimum, so the map fills the card when the
        // weather card beside it is taller.
        className="relative z-0 min-h-75 flex-1 bg-[#f5f5f5] max-sm:min-h-60"
      >
        {/* Leaflet owns this element; the iframe below covers it until Leaflet is ready. */}
        <div ref={container} className="h-full" />
        {!interactive && (
          <iframe
            src={OSM_EMBED}
            title="Map of Bukidnon"
            loading="lazy"
            aria-label="OpenStreetMap of Bukidnon with a marker on the Provincial Capitol in Malaybalay City"
            className="absolute inset-0 block size-full border-0"
          />
        )}
      </div>
      {selected && (
        <div
          aria-live="polite"
          className="mx-4 mt-3.5 rounded-[10px] border border-primary/15 bg-slate-50 px-4 py-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="mb-1 text-base font-semibold text-ink">{selected.name}</h3>
              <p className="m-0 text-sm text-ink-light">
                {selected.classification} · District {selected.district} · {selected.barangay_count}{' '}
                Barangays · Pop. ({selected.population.latest_year}):{' '}
                {selected.population.latest.toLocaleString('en-US')}
              </p>
            </div>
            <div className="flex gap-2">
              <a
                className="rounded-site bg-primary px-3 py-2 text-sm font-semibold text-white no-underline"
                href={localizePath(`/lgus/${selected.slug}`, getLocale())}
              >
                View Profile
              </a>
              <a
                className="rounded-site border border-primary px-3 py-2 text-sm font-semibold text-primary no-underline"
                href={localizePath(`/barangays?lgu=${selected.slug}`, getLocale())}
              >
                Barangays
              </a>
            </div>
          </div>
        </div>
      )}
      <p className="m-0 flex items-center gap-1.5 border-t border-black/5 bg-white px-6 py-3 text-[0.75rem] text-ink-light">
        <Icon name="geo-alt" className="text-[0.8125rem] text-primary" />
        <span>{m.home_capitol_address()}</span>
      </p>
      <p className="sr-only">{m.home_map_description()}</p>
    </div>
  )
}

export function WeatherMap() {
  const [weatherLocation, setWeatherLocation] = useState(CAPITOL_LOCATION)

  return (
    <section className="bg-surface-alt py-12 max-xl:py-8 max-md:py-6">
      <div className="container-site">
        <GlanceHeader title={m.home_weather_and_map_of_bukidnon()} />
        <div className="grid grid-cols-[340px_minmax(0,1fr)] items-stretch gap-8 max-lg:grid-cols-[minmax(0,1fr)] max-lg:gap-6">
          <div className="flex flex-col" aria-live="polite">
            <WeatherCard location={weatherLocation} />
          </div>
          <div className="flex flex-col">
            <CapitolMap onLocationChange={setWeatherLocation} />
          </div>
        </div>
      </div>
    </section>
  )
}
