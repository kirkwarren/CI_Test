import React, { useMemo, useState } from 'react';
import {
  niceTicks,
  padDomain,
  scaleLinear,
  useContainerWidth,
  TooltipLayer,
} from './utils';

const MARGIN = { top: 12, right: 16, bottom: 40, left: 64 };
const HIT_RADIUS = 24;

/**
 * Generic dot plot. Points: {id, x, y, fill, r?, data?}. Hover uses
 * nearest-point hit testing (targets ~24px, far larger than the dots);
 * every dot carries a 2px surface ring.
 */
export default function ScatterPlot({
  height = 320,
  points,
  xFormat = String,
  yFormat = String,
  xLabel,
  refY,
  refYLabel,
  selectedId,
  onPointClick,
  renderTooltip,
}) {
  const [wrapRef, width] = useContainerWidth();
  const [hovered, setHovered] = useState(null);

  const plotW = Math.max(0, width - MARGIN.left - MARGIN.right);
  const plotH = height - MARGIN.top - MARGIN.bottom;

  const { placed, xTicks, yTicks, sx, sy } = useMemo(() => {
    const xd = padDomain(points.map((p) => p.x));
    const yd = padDomain(points.map((p) => p.y), 0.06, refY != null ? [refY] : []);
    const sx = scaleLinear(xd, [0, plotW]);
    const sy = scaleLinear(yd, [plotH, 0]);
    return {
      sx,
      sy,
      placed: points.map((p) => ({ ...p, px: sx(p.x), py: sy(p.y) })),
      xTicks: niceTicks(xd[0], xd[1], Math.max(3, Math.floor(plotW / 110))),
      yTicks: niceTicks(yd[0], yd[1], 5),
    };
  }, [points, plotW, plotH, refY]);

  const findNearest = (evt) => {
    const rect = evt.currentTarget.getBoundingClientRect();
    const mx = evt.clientX - rect.left - MARGIN.left;
    const my = evt.clientY - rect.top - MARGIN.top;
    let best = null;
    let bestD = HIT_RADIUS;
    for (const p of placed) {
      const d = Math.hypot(p.px - mx, p.py - my);
      if (d < bestD) {
        bestD = d;
        best = p;
      }
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
        style={{ cursor: hovered && onPointClick ? 'pointer' : 'default' }}
        onMouseMove={(e) => setHovered(findNearest(e))}
        onMouseLeave={() => setHovered(null)}
        onClick={(e) => {
          const p = findNearest(e);
          if (p && onPointClick) onPointClick(p);
        }}
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
            <g key={`x${t}`}>
              <line x1={sx(t)} x2={sx(t)} y1={0} y2={plotH} stroke="var(--grid)" strokeWidth={1} />
              <text
                x={sx(t)}
                y={plotH + 16}
                textAnchor="middle"
                fontSize={11}
                fill="var(--text-muted)"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {xFormat(t)}
              </text>
            </g>
          ))}
          <line x1={0} x2={plotW} y1={plotH} y2={plotH} stroke="var(--baseline)" strokeWidth={1} />
          {refY != null && (
            <g>
              <line x1={0} x2={plotW} y1={sy(refY)} y2={sy(refY)} stroke="var(--series-1)" strokeWidth={2} />
              {refYLabel && (
                <text
                  x={plotW - 4}
                  y={sy(refY) - 6}
                  textAnchor="end"
                  fontSize={10}
                  fill="var(--text-secondary)"
                  stroke="var(--surface-1)"
                  strokeWidth={3}
                  paintOrder="stroke"
                >
                  {refYLabel}
                </text>
              )}
            </g>
          )}
          {placed.map((p) => (
            <circle
              key={p.id}
              cx={p.px}
              cy={p.py}
              r={p.id === selectedId ? 8 : hovered?.id === p.id ? 7 : p.r ?? 5.5}
              fill={p.fill}
              stroke="var(--surface-1)"
              strokeWidth={2}
            />
          ))}
          {xLabel && (
            <text
              x={plotW / 2}
              y={plotH + 34}
              textAnchor="middle"
              fontSize={11}
              fill="var(--text-muted)"
            >
              {xLabel}
            </text>
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
