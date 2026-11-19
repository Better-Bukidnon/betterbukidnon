'use client';

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Legend, Tooltip);

interface ChartProps {
  labels: string[];
  values: number[];
  colors: string[];
  ariaLabel: string;
}

const n = (v: number) => v.toLocaleString('en-US');
const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const tooltip = { backgroundColor: 'rgba(0, 50, 160, 0.95)', padding: 12, cornerRadius: 8 };

/** Loaded with next/dynamic (ssr: false); the parent reserves the height, so no layout shift. */
export function DistrictChart({ labels, values, colors, ariaLabel }: ChartProps) {
  const total = values.reduce((a, b) => a + b, 0);
  return (
    <Doughnut
      role="img"
      aria-label={ariaLabel}
      data={{
        labels,
        datasets: [{ data: values, backgroundColor: colors, borderColor: '#fff', borderWidth: 3 }],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        animation: reducedMotion() ? false : { duration: 500, easing: 'easeOutQuart' },
        cutout: '55%',
        plugins: {
          legend: { position: 'bottom', labels: { usePointStyle: true } },
          tooltip: {
            ...tooltip,
            callbacks: {
              label: (i) =>
                `${n(i.raw as number)} (${((Number(i.raw) / total) * 100).toFixed(1)}%)`,
            },
          },
        },
      }}
    />
  );
}

export function PopulationBarChart({ labels, values, colors, ariaLabel }: ChartProps) {
  return (
    <Bar
      role="img"
      aria-label={ariaLabel}
      data={{ labels, datasets: [{ data: values, backgroundColor: colors, borderRadius: 4 }] }}
      options={{
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: reducedMotion() ? false : { duration: 500, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: {
            ...tooltip,
            displayColors: false,
            callbacks: { label: (i) => n(i.raw as number) },
          },
        },
        scales: {
          x: { beginAtZero: true, ticks: { callback: (v) => n(Number(v)) } },
          y: { grid: { display: false }, ticks: { autoSkip: false } },
        },
      }}
    />
  );
}
