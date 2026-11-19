'use client';

import { useCallback, useEffect, useState, type ComponentType, type SVGProps } from 'react';
import {
  ArrowClockwise,
  CloudDrizzleFill,
  CloudFogFill,
  CloudLightningRainFill,
  CloudRainFill,
  CloudRainHeavyFill,
  CloudSlash,
  CloudsFill,
  CloudSunFill,
  Droplet,
  GeoAlt,
  SunFill,
  Wind,
} from 'react-bootstrap-icons';
import { cachedFetch } from '@/features/layout/cachedFetch';

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

// WMO weather codes, as in fce5da9:assets/js/weather-map.js.
const CODES: Record<number, [string, Icon]> = {
  0: ['Clear sky', SunFill],
  1: ['Mainly clear', CloudSunFill],
  2: ['Partly cloudy', CloudSunFill],
  3: ['Overcast', CloudsFill],
  45: ['Foggy', CloudFogFill],
  48: ['Depositing rime fog', CloudFogFill],
  51: ['Light drizzle', CloudDrizzleFill],
  53: ['Moderate drizzle', CloudDrizzleFill],
  55: ['Dense drizzle', CloudDrizzleFill],
  61: ['Slight rain', CloudRainFill],
  63: ['Moderate rain', CloudRainFill],
  65: ['Heavy rain', CloudRainHeavyFill],
  80: ['Rain showers', CloudRainFill],
  95: ['Thunderstorm', CloudLightningRainFill],
};
const lookup = (code: number) => CODES[code] ?? ['Partly cloudy', CloudSunFill];

export interface Weather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  code: number;
  hours: { time: string; temperature: number; code: number }[];
}

interface OpenMeteo {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  hourly: { time: string[]; temperature_2m: number[]; weather_code: number[] };
}

const hourLabel = (iso: string) => {
  const h = Number(iso.slice(11, 13));
  return `${h % 12 || 12} ${h < 12 ? 'AM' : 'PM'}`;
};

/** Times are Manila wall-clock strings, so the next hours are found by string compare, not the visitor's clock. */
export function toWeather({ current, hourly }: OpenMeteo): Weather {
  const start = hourly.time.findIndex((t) => t.slice(0, 13) >= current.time.slice(0, 13));
  if (start < 0 || typeof current.temperature_2m !== 'number') throw new Error('Bad forecast');
  const hours = hourly.time.slice(start, start + 4).map((time, i) => ({
    time: hourLabel(time),
    temperature: Math.round(hourly.temperature_2m[start + i]),
    code: hourly.weather_code[start + i],
  }));
  return {
    temperature: Math.round(current.temperature_2m),
    humidity: current.relative_humidity_2m,
    windSpeed: Math.round(current.wind_speed_10m),
    code: current.weather_code,
    hours,
  };
}

const API =
  'https://api.open-meteo.com/v1/forecast?latitude=8.1575&longitude=125.1278' +
  '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m' +
  '&hourly=temperature_2m,weather_code&timezone=Asia%2FManila&forecast_days=2';

async function fetchWeather(): Promise<Weather> {
  const res = await fetch(API, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return toWeather(await res.json());
}

const card = 'min-h-[17rem] rounded-base bg-primary p-md text-white';

/** Live Malaybalay weather: fresh cache, else network, else last known, else an honest "unavailable". */
export function WeatherWidget() {
  const [state, setState] = useState<Weather | 'loading' | 'error'>('loading');

  const load = useCallback(() => {
    setState('loading');
    cachedFetch('home_weather', 30 * 60_000, fetchWeather).then((w) => setState(w ?? 'error'));
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- first load on mount
  useEffect(load, [load]);

  if (state === 'loading') {
    return (
      <div className={`${card} animate-pulse`} aria-busy="true" aria-label="Loading weather" />
    );
  }

  if (state === 'error') {
    return (
      <div className={`${card} flex flex-col items-center justify-center gap-sm`} role="alert">
        <CloudSlash aria-hidden className="size-10 opacity-70" />
        <p>Weather data unavailable</p>
        <button
          type="button"
          onClick={load}
          data-surface="dark"
          className="inline-flex min-h-11 items-center gap-xs rounded-base bg-white/15 px-md font-semibold transition-colors duration-150 ease-out hover:bg-white/25 active:scale-[0.97]"
        >
          <ArrowClockwise aria-hidden /> Retry
        </button>
      </div>
    );
  }

  const [condition, CurrentIcon] = lookup(state.code);
  return (
    <section
      data-surface="dark"
      className={card}
      aria-label="Current weather in Malaybalay City, Bukidnon"
    >
      <div className="mb-md flex items-center gap-md">
        <CurrentIcon aria-hidden className="size-14 shrink-0" />
        <div>
          <p className="text-4xl font-bold tabular-nums">{state.temperature}°C</p>
          <p className="text-white/90">{condition}</p>
          <p className="flex items-center gap-1 text-sm text-white/80">
            <GeoAlt aria-hidden /> Malaybalay City, Bukidnon
          </p>
        </div>
      </div>
      <ul className="mb-md flex gap-md text-sm" aria-label="Weather details">
        <li className="flex items-center gap-1" aria-label={`Humidity ${state.humidity} percent`}>
          <Droplet aria-hidden /> {state.humidity}%
        </li>
        <li
          className="flex items-center gap-1"
          aria-label={`Wind speed ${state.windSpeed} kilometers per hour`}
        >
          <Wind aria-hidden /> {state.windSpeed} km/h
        </li>
      </ul>
      <ul className="grid grid-cols-4 gap-xs text-center text-sm" aria-label="Hourly forecast">
        {state.hours.map((h) => {
          const [label, HourIcon] = lookup(h.code);
          return (
            <li key={h.time} className="rounded-base bg-white/10 py-xs">
              <span className="block text-xs text-white/80">{h.time}</span>
              <HourIcon aria-label={label} className="mx-auto my-1" />
              <span className="font-semibold tabular-nums">{h.temperature}°</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
