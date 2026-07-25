import React, { useMemo, useState } from 'react';
import {
  niceTicks,
  padDomain,
  scaleLinear,
  useContainerWidth,
  TooltipLayer,
} from './utils';

const MARGIN = { top: 16, right: 16, bottom: 28, left: 60 };

/**
 * Single-series line chart (2px, round caps). Hover shows a crosshair at the
 * nearest x plus a ringed active dot; a solid hairline marks y=0 when the
 * domain crosses it, and refX draws a labeled vertical marker.
 */
export default function LineChart({
  height = 220,
  data, // [{x, y}]
  xFormat = String,
  yFormat = String,
  refX,
  refXLabel,
  renderTooltip,
}) {
  const [wrapRef, width] = useContainerWidth();
  const [hovered, setHovered] = useState(null);

  const plotW = Math.max(0, width - MARGIN.left - MARGIN.right);
  const plotH = height - MARGIN.top - MARGIN.bottom;

  const { placed, path, xTicks, yTicks, sx, sy, yd } = useMemo(() => {
    const xd = [Math.min(...data.map((d) => d.x)), Math.max(...data.map((d) => d.x))];
    const yd = padDomain(data.map((d) => d.y), 0.08, [0]);
    const sx = scaleLinear(xd, [0, plotW]);
    const sy = scaleLinear(yd, [plotH, 0]);
    const placed = data.map((d) => ({ ...d, px: sx(d.x), py: sy(d.y) }));
    return {
      placed,
      path: placed.map((p, i) => `${i ? 'L' : 'M'}${p.px},${p.py}`).join(''),
      xTicks: niceTicks(xd[0], xd[1], Math.max(4, Math.floor(plotW / 60))),
      yTicks: niceTicks(yd[0], yd[1], 4),
      sx,
      sy,
      yd,
    };
  }, [data, plotW, plotH]);

  const nearest = (evt) => {
    const rect = evt.currentTarget.getBoundingClientRect();
    const mx = evt.clientX - rect.left - MARGIN.left;
    let best = null;
    for (const p of placed) {
      if (!best || Math.abs(p.px - mx) < Math.abs(best.px - mx)) best = p;
    }
    return best;
  };

  if (width === 0) return <div ref={wrapRef} style={{ height }} />;

  return (
    <div ref={wrapRef} className="relative" style={{ height }}>
      <svg
        width={width}
        height={height}
        role="img"
        onMouseMove={(e) => setHovered(nearest(e))}
        onMouseLeave={() => setHovered(null)}
      >
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          {yTicks.map((t) => (
            <g key={`y${t}`}>
              <line x1={0} x2={plotW} y1={sy(t)} y2={sy(t)} stroke="var(--grid)" strokeWidth={1} />
              <text
                x={-8}
                y={sy(t)}
                dy="0.32em"
                textAnchor="end"
                fontSize={11}
                fill="var(--text-muted)"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {yFormat(t)}
              </text>
            </g>
          ))}
          {xTicks.map((t) => (
            <text
              key={`x${t}`}
              x={sx(t)}
              y={plotH + 18}
              textAnchor="middle"
              fontSize={11}
              fill="var(--text-muted)"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {xFormat(t)}
            </text>
          ))}
          {yd[0] < 0 && yd[1] > 0 && (
            <line x1={0} x2={plotW} y1={sy(0)} y2={sy(0)} stroke="var(--baseline)" strokeWidth={1} />
          )}
          {refX != null && (
            <g>
              <line x1={sx(refX)} x2={sx(refX)} y1={0} y2={plotH} stroke="var(--baseline)" strokeWidth={1} />
              {refXLabel && (
                <text
                  x={sx(refX)}
                  y={-4}
                  textAnchor="middle"
                  fontSize={10}
                  fill="var(--text-muted)"
                >
                  {refXLabel}
                </text>
              )}
            </g>
          )}
          {hovered && (
            <line
              x1={hovered.px}
              x2={hovered.px}
              y1={0}
              y2={plotH}
              stroke="var(--baseline)"
              strokeWidth={1}
            />
          )}
          <path
            d={path}
            fill="none"
            stroke="var(--series-1)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {hovered && (
            <circle
              cx={hovered.px}
              cy={hovered.py}
              r={4.5}
              fill="var(--series-1)"
              stroke="var(--surface-1)"
              strokeWidth={2}
            />
          )}
        </g>
      </svg>
      {hovered && renderTooltip && (
        <TooltipLayer x={hovered.px + MARGIN.left} y={hovered.py + MARGIN.top} width={width}>
          {renderTooltip(hovered)}
        </TooltipLayer>
      )}
    </div>
  );
}
