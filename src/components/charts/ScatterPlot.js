import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  niceTicks,
  padDomain,
  scaleLinear,
  useContainerWidth,
  TooltipLayer,
} from './utils';

const MARGIN = { top: 12, right: 16, bottom: 40, left: 64 };
const HIT_RADIUS = 24;
// Past this many points, SVG circles bog the browser down; draw to canvas
// instead. Hit-testing is nearest-point against the data either way, so
// interaction is identical.
const CANVAS_THRESHOLD = 400;

/**
 * Generic dot plot. Points: {id, x, y, fill, r?, data?}. Hover uses
 * nearest-point hit testing (targets ~24px, far larger than the dots);
 * every dot carries a 2px surface ring.
 */
/**
 * Canvas takes real color values — `fillStyle = 'var(--series-1)'` is invalid
 * and silently leaves the previous color in place (everything renders black).
 * Resolve custom properties against the document, memoized per draw since
 * getComputedStyle is not cheap.
 */
function makeColorResolver() {
  const cache = new Map();
  const root = getComputedStyle(document.documentElement);
  return (color) => {
    if (cache.has(color)) return cache.get(color);
    const m = /^var\((--[\w-]+)\)$/.exec(String(color).trim());
    const out = m ? root.getPropertyValue(m[1]).trim() || '#888781' : color;
    cache.set(color, out);
    return out;
  };
}

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
  const canvasRef = useRef(null);
  // Canvas colors are resolved at draw time, so a light/dark switch has to
  // force a redraw — CSS alone can't restyle pixels already painted.
  const [scheme, setScheme] = useState(0);
  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setScheme((n) => n + 1);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  const plotW = Math.max(0, width - MARGIN.left - MARGIN.right);
  const plotH = height - MARGIN.top - MARGIN.bottom;
  const useCanvas = points.length > CANVAS_THRESHOLD;

  const { placed, xTicks, yTicks, sx, sy } = useMemo(() => {
    const xd = padDomain(points.map((p) => p.x));
    const yd = padDomain(points.map((p) => p.y), 0.06, refY != null ? [refY] : []);
    const fx = scaleLinear(xd, [0, plotW]);
    const fy = scaleLinear(yd, [plotH, 0]);
    return {
      sx: fx,
      sy: fy,
      placed: points.map((p) => ({ ...p, px: fx(p.x), py: fy(p.y) })),
      xTicks: niceTicks(xd[0], xd[1], Math.max(3, Math.floor(plotW / 110))),
      yTicks: niceTicks(yd[0], yd[1], 5),
    };
  }, [points, plotW, plotH, refY]);

  // Canvas marks layer. Redraws on data, size, hover or selection change.
  useEffect(() => {
    if (!useCanvas) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext && canvas.getContext('2d');
    if (!ctx) return; // jsdom and other canvas-less environments

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.round(plotW * dpr));
    canvas.height = Math.max(1, Math.round(plotH * dpr));
    canvas.style.width = `${plotW}px`;
    canvas.style.height = `${plotH}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, plotW, plotH);

    const resolve = makeColorResolver();
    ctx.lineWidth = 2;
    ctx.strokeStyle = resolve('var(--surface-1)') || '#fcfcfb';

    for (const p of placed) {
      const emphasized = p.id === selectedId || p.id === hovered?.id;
      ctx.beginPath();
      ctx.arc(p.px, p.py, emphasized ? 7 : p.r ?? 4, 0, Math.PI * 2);
      ctx.fillStyle = resolve(p.fill);
      ctx.fill();
      ctx.stroke();
    }
  }, [useCanvas, placed, plotW, plotH, selectedId, hovered, scheme]);

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
      {useCanvas && (
        <canvas
          ref={canvasRef}
          className="absolute pointer-events-none"
          style={{ left: MARGIN.left, top: MARGIN.top }}
        />
      )}
      <svg
        width={width}
        height={height}
        role="img"
        className="relative"
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

          {/* Small sets draw as SVG (crisper); large sets go to the canvas
              layer above, with only the hovered/selected dot kept in SVG so it
              always sits on top. */}
          {!useCanvas &&
            placed.map((p) => (
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
          {useCanvas && hovered && (
            <circle
              cx={hovered.px}
              cy={hovered.py}
              r={7}
              fill={hovered.fill}
              stroke="var(--surface-1)"
              strokeWidth={2}
            />
          )}

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
