// Charts: hand-rolled SVG and CSS bars, no libraries. Both functions take plain
// data and return an HTML string the views drop into the page.

import { CATEGORIES } from './data.js';

export function categoryColor(id) {
  return (CATEGORIES.find((c) => c.id === id) || {}).color || '#8a8378';
}

export function categoryLabel(id) {
  return (CATEGORIES.find((c) => c.id === id) || {}).label || id;
}

// A donut of spending by category. slices: [{label, value, color}].
export function donut(slices, size = 190) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  if (total <= 0) return '<p class="empty">No spending in this month yet.</p>';
  const r = 70;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  const arcs = slices.map((s) => {
    const frac = s.value / total;
    const len = frac * circumference;
    const piece =
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${s.color}" stroke-width="26" ` +
      `stroke-dasharray="${len.toFixed(1)} ${(circumference - len).toFixed(1)}" ` +
      `stroke-dashoffset="${(-offset).toFixed(1)}" />`;
    offset += len;
    return piece;
  }).join('');
  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img"
     aria-label="Spending by category, total ${total.toFixed(0)} dollars">
  <g transform="rotate(-90 ${cx} ${cy})">${arcs}</g>
  <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="15" fill="#6f675c">Spent</text>
  <text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="19" font-weight="bold" fill="#2e2a24">$${total.toLocaleString('en-US', { maximumFractionDigits: 0 })}</text>
</svg>`;
}

// Paired income/spending bars for a list of months.
// rows: [{label, income, spending}]
export function monthBars(rows) {
  const max = Math.max(1, ...rows.flatMap((r) => [r.income, r.spending]));
  const cols = rows.map((r) => {
    const incH = Math.max(2, Math.round((r.income / max) * 140));
    const outH = Math.max(2, Math.round((r.spending / max) * 140));
    return `
<div class="bar-col">
  <span class="bar-val">$${Math.round(r.income).toLocaleString('en-US')}</span>
  <div class="bar income" style="height:${incH}px" title="Income ${r.label}"></div>
  <div class="bar" style="height:${outH}px" title="Spending ${r.label}"></div>
  <span class="bar-val">$${Math.round(r.spending).toLocaleString('en-US')}</span>
  <span>${r.label}</span>
</div>`;
  }).join('');
  return `
<div class="bars" role="img" aria-label="Income and spending by month">${cols}</div>
<p class="stat-note">Green bar: money in. Blue bar: money out. October and November are the
months this household has recorded so far.</p>`;
}
