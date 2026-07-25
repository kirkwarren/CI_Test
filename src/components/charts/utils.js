import { useEffect, useRef, useState } from 'react';

/** "Nice" tick values covering [min, max]. */
export function niceTicks(min, max, count = 5) {
  if (min === max) {
    min -= 1;
    max += 1;
  }
  const span = max - min;
  const step0 = span / Math.max(1, count);
  const mag = Math.pow(10, Math.floor(Math.log10(step0)));
  const norm = step0 / mag;
  const step = (norm >= 5 ? 10 : norm >= 2 ? 5 : norm >= 1 ? 2 : 1) * mag;
  const start = Math.ceil(min / step) * step;
  const ticks = [];
  for (let v = start; v <= max + step * 1e-6; v += step) {
    ticks.push(+v.toPrecision(12));
  }
  return ticks;
}

/** Domain padded a little beyond the data, always covering `include`. */
export function padDomain(values, pad = 0.06, include = []) {
  const all = [...values, ...include].filter((v) => Number.isFinite(v));
  if (!all.length) return [0, 1];
  let min = Math.min(...all);
  let max = Math.max(...all);
  const span = max - min || Math.abs(max) || 1;
  return [min - span * pad, max + span * pad];
}

export const scaleLinear = ([d0, d1], [r0, r1]) => (v) =>
  r0 + ((v - d0) / (d1 - d0 || 1)) * (r1 - r0);

/** Observed pixel width of a container element. */
export function useContainerWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => setWidth(el.clientWidth);
    measure();
    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      ro.observe(el);
    } else {
      window.addEventListener('resize', measure);
    }
    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', measure);
    };
  }, []);
  return [ref, width];
}

/** Absolutely-positioned tooltip container, kept inside the chart bounds. */
export function TooltipLayer({ x, y, width, children }) {
  if (!children) return null;
  const flip = width > 0 && x > width * 0.55;
  return (
    <div
      className="absolute z-10 pointer-events-none"
      style={{
        left: x,
        top: y,
        transform: `translate(${flip ? 'calc(-100% - 12px)' : '12px'}, -50%)`,
      }}
    >
      {children}
    </div>
  );
}
