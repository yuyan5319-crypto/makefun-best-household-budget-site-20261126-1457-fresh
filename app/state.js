// State: loads the seed data on first visit, then keeps the household's edits in
// localStorage under one key. Every number on screen is computed from this state,
// never hard-coded into the views.

import { BUDGETS, BILLS, GOALS, HOUSEHOLD, TRANSACTIONS } from './data.js';

const KEY = 'hearthledger-v1';

export function defaultState() {
  return {
    household: HOUSEHOLD,
    month: HOUSEHOLD.month,
    transactions: TRANSACTIONS.map((t) => ({ ...t })),
    budgets: BUDGETS.map((b) => ({ ...b })),
    bills: BILLS.map((b) => ({ ...b })),
    goals: GOALS.map((g) => ({ ...g })),
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.transactions)) return defaultState();
    return parsed;
  } catch {
    return defaultState();
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function resetState() {
  localStorage.removeItem(KEY);
  return defaultState();
}

export function monthOf(date) {
  return String(date).slice(0, 7);
}

export function transactionsFor(state, month) {
  return state.transactions
    .filter((t) => monthOf(t.date) === month)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function monthTotals(state, month) {
  let income = 0;
  let spending = 0;
  for (const t of state.transactions) {
    if (monthOf(t.date) !== month) continue;
    if (t.amount > 0) income += t.amount;
    else spending += -t.amount;
  }
  return { income, spending, left: income - spending };
}

export function spentByCategory(state, month) {
  const out = {};
  for (const t of state.transactions) {
    if (monthOf(t.date) !== month || t.amount >= 0) continue;
    out[t.category] = (out[t.category] || 0) + -t.amount;
  }
  return out;
}

export function budgetStatus(state, month) {
  const spent = spentByCategory(state, month);
  return state.budgets.map((b) => {
    const used = spent[b.category] || 0;
    const pct = b.limit > 0 ? (used / b.limit) * 100 : 0;
    const stateWord = pct >= 100 ? 'over' : pct >= 80 ? 'near' : 'ok';
    return { ...b, used, pct, stateWord };
  });
}

export function monthLabel(month) {
  const [year, m] = month.split('-').map(Number);
  return new Date(year, m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function shiftMonth(month, delta) {
  const [year, m] = month.split('-').map(Number);
  const d = new Date(year, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function money(n) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function shortDate(date) {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function nextId(prefix) {
  return `${prefix}-${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
}
