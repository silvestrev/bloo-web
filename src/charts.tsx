import { useId } from 'react';

/** Linha suave (Catmull-Rom convertido em Bézier). */
function smoothPath(points: [number, number][]) {
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
  }
  return d;
}

function straightPath(points: [number, number][]) {
  return points.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ');
}

interface AreaChartProps {
  current: number[];
  previous?: number[];
  /** Rótulos do eixo X (início, meio, fim...). */
  xLabels?: string[];
  yTicks?: number[];
  height?: number;
  smooth?: boolean;
  grid?: boolean;
}

/** Gráfico de área do período atual com o período anterior tracejado. Decorativo. */
export function AreaChart({ current, previous, xLabels, yTicks, height = 160, smooth = false, grid = true }: AreaChartProps) {
  const id = useId();
  const width = 600;
  const left = yTicks ? 28 : 0;
  const bottom = xLabels ? 20 : 0;
  const all = [...current, ...(previous ?? []), ...(yTicks ?? [])];
  const max = Math.max(...all);
  const min = yTicks ? Math.min(...yTicks) : Math.min(...all) * 0.85;
  const plotH = height - bottom - 6;
  const toPoints = (data: number[]): [number, number][] =>
    data.map((v, i) => [left + (i / (data.length - 1)) * (width - left - 4), 6 + (1 - (v - min) / (max - min)) * plotH]);
  const path = smooth ? smoothPath : straightPath;
  const cur = toPoints(current);
  const line = path(cur);
  const area = `${line} L${cur[cur.length - 1][0]},${6 + plotH} L${cur[0][0]},${6 + plotH} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="chart" aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--kaz-primary-solid)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--kaz-primary-solid)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {grid &&
        (yTicks ?? [0, 1, 2, 3]).map((tick, i, list) => {
          const y = yTicks ? 6 + (1 - (tick - min) / (max - min)) * plotH : 6 + (i / (list.length - 1)) * plotH;
          return (
            <g key={i}>
              <line x1={left} x2={width} y1={y} y2={y} className="chart__grid" />
              {yTicks && (
                <text x={0} y={y + 3} className="chart__label">
                  {tick >= 1000 ? `${tick / 1000}k` : tick}
                </text>
              )}
            </g>
          );
        })}
      <path d={area} fill={`url(#${id})`} />
      {previous && <path d={path(toPoints(previous))} className="chart__previous" />}
      <path d={line} className="chart__line" />
      {xLabels?.map((label, i) => (
        <text
          key={label}
          x={left + (i / (xLabels.length - 1)) * (width - left - 4)}
          y={height - 4}
          textAnchor={i === 0 ? 'start' : i === xLabels.length - 1 ? 'end' : 'middle'}
          className="chart__label"
        >
          {label}
        </text>
      ))}
    </svg>
  );
}

/** Barras verticais finas, como no "momentum" da referência. Decorativo. */
export function BarStrip({ data, height = 120, rounded = true, gap = 0.45 }: { data: number[]; height?: number; rounded?: boolean; gap?: number }) {
  const width = 600;
  const max = Math.max(...data);
  const step = width / data.length;
  const barW = step * (1 - gap);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="chart" aria-hidden="true" preserveAspectRatio="none">
      {data.map((v, i) => {
        const h = (v / max) * (height - 4);
        return <rect key={i} x={i * step + (step - barW) / 2} y={height - h} width={barW} height={h} rx={rounded ? barW / 2 : 0} className="chart__bar" />;
      })}
    </svg>
  );
}
