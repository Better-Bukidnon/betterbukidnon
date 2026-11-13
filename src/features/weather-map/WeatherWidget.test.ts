import { toWeather } from '@/features/weather-map/WeatherWidget';

const hours = Array.from({ length: 48 }, (_, i) => {
  const day = i < 24 ? '11' : '12';
  return `2026-11-${day}T${String(i % 24).padStart(2, '0')}:00`;
});

it('takes the next four Manila hours from the current time, across midnight', () => {
  const w = toWeather({
    current: {
      time: '2026-11-11T22:45',
      temperature_2m: 21.6,
      relative_humidity_2m: 88,
      weather_code: 61,
      wind_speed_10m: 4.4,
    },
    hourly: {
      time: hours,
      temperature_2m: hours.map((_, i) => i),
      weather_code: hours.map(() => 3),
    },
  });
  expect(w.temperature).toBe(22);
  expect(w.windSpeed).toBe(4);
  expect(w.hours.map((h) => h.time)).toEqual(['10 PM', '11 PM', '12 AM', '1 AM']);
  expect(w.hours.map((h) => h.temperature)).toEqual([22, 23, 24, 25]);
});
