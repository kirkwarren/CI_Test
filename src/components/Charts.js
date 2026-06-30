import React from 'react';

// Lightweight, dependency-free SVG charts — fully styleable and robust.

export const AreaTrend = ({ data, height = 150 }) => {
  const w = 320;
  const h = height;
  const pad = 22;
  const values = data.map((d) => d.pounds);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const stepX = (w - pad * 2) / (data.length - 1);
  const x = (i) => pad + i * stepX;
  const y = (v) => pad / 2 + (h - pad - pad / 2) * (1 - (v - min) / range);

  const linePts = data.map((d, i) => `${x(i)},${y(d.pounds)}`).join(' ');
  const areaPts = `${pad},${h - pad} ${linePts} ${w - pad},${h - pad}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={areaPts} fill="url(#areaFill)" />
      <polyline points={linePts} fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((d, i) => (
        <g key={d.week}>
          <circle cx={x(i)} cy={y(d.pounds)} r="3" fill="#0f172a" stroke="#34d399" strokeWidth="2" />
          <text x={x(i)} y={h - 6} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)">{d.week}</text>
        </g>
      ))}
    </svg>
  );
};

export const Donut = ({ data, colors, size = 120 }) => {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = 42;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg viewBox="0 0 120 120" style={{ width: size, height: size }} className="mx-auto -rotate-90">
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" />
      {data.map((d, i) => {
        const frac = d.value / total;
        const dash = frac * c;
        const seg = (
          <circle
            key={d.name}
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke={colors[i % colors.length]}
            strokeWidth="14"
            strokeDasharray={`${dash} ${c - dash}`}
            strokeDashoffset={-offset}
            strokeLinecap="butt"
          />
        );
        offset += dash;
        return seg;
      })}
    </svg>
  );
};
