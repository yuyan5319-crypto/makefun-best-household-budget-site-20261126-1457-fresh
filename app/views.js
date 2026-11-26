// Views: one render function per page. Each returns HTML; app.js wires the
// buttons and forms after the HTML is in the page.

import { CATEGORIES } from './data.js';
import {
  budgetStatus, money, monthLabel, monthTotals, shortDate, spentByCategory,
  transactionsFor, shiftMonth,
} from './state.js';
import { categoryColor, categoryLabel, donut, monthBars } from './charts.js';

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function monthSwitcher(state) {
  return `
<div class="month-switch" role="group" aria-label="Choose month">
  <button type="button" data-month-shift="-1" aria-label="Previous month">&larr;</button>
  <strong>${monthLabel(state.month)}</strong>
  <button type="button" data-month-shift="1" aria-label="Next month">&rarr;</button>
</div>`;
}

function categoryOptions(selected = '') {
  return CATEGORIES.filter((c) => c.id !== 'income').map((c) =>
    `<option value="${c.id}"${c.id === selected ? ' selected' : ''}>${c.label}</option>`).join('');
}

export function dashboard(state) {
  const totals = monthTotals(state, state.month);
  const spent = spentByCategory(state, state.month);
  const budgets = budgetStatus(state, state.month);
  const over = budgets.filter((b) => b.stateWord === 'over').length;
  const unpaid = state.bills.filter((b) => !b.paid);
  const recent = transactionsFor(state, state.month).slice(0, 6);
  const slices = Object.entries(spent)
    .map(([cat, value]) => ({ label: categoryLabel(cat), value, color: categoryColor(cat) }))
    .sort((a, b) => b.value - a.value);
  const leftClass = totals.left >= 0 ? 'good' : 'bad';

  return `
<div class="page-head">
  <div><h1>November at a glance</h1>
  <p>${esc(state.household.name)} &middot; ${esc(state.household.members)}</p></div>
  ${monthSwitcher(state)}
</div>

<div class="grid three" style="margin-top:18px">
  <section class="card">
    <p class="stat-label">Money in</p>
    <p class="stat-value good">${money(totals.income)}</p>
    <p class="stat-note">Paydays plus Mara's freelance work this month.</p>
  </section>
  <section class="card">
    <p class="stat-label">Money out</p>
    <p class="stat-value">${money(totals.spending)}</p>
    <p class="stat-note">${over ? `${over} budget${over > 1 ? 's' : ''} over the limit.` : 'Every budget is inside its limit.'}</p>
  </section>
  <section class="card">
    <p class="stat-label">Left over</p>
    <p class="stat-value ${leftClass}">${money(totals.left)}</p>
    <p class="stat-note">${totals.left >= 0 ? 'Goes to the emergency fund and the cabin trip.' : 'More went out than came in — check the budgets.'}</p>
  </section>
</div>

<div class="grid two" style="margin-top:16px">
  <section class="card">
    <h2>Where the money went</h2>
    <div class="chart-wrap">
      ${donut(slices)}
      <ul class="chart-legend">
        ${slices.slice(0, 6).map((s) => `
        <li><span class="swatch" style="background:${s.color}"></span>${esc(s.label)}
        <span class="legend-amt">${money(s.value)}</span></li>`).join('')}
      </ul>
    </div>
    <p><a href="#/reports">See the full monthly report &rarr;</a></p>
  </section>

  <section class="card">
    <h2>Budgets this month</h2>
    ${budgets.slice(0, 4).map((b) => `
    <div class="budget-row">
      <div class="row-head"><strong>${categoryLabel(b.category)}</strong>
      <span>${money(b.used)} of ${money(b.limit)}</span></div>
      <div class="bar-track"><div class="bar-fill ${b.stateWord === 'over' ? 'over' : b.stateWord === 'near' ? 'near' : ''}" style="width:${Math.min(100, b.pct).toFixed(0)}%"></div></div>
    </div>`).join('')}
    <p><a href="#/budgets">All budgets &rarr;</a></p>
  </section>
</div>

<div class="grid two" style="margin-top:16px">
  <section class="card">
    <h2>Bills still to pay</h2>
    ${unpaid.length === 0
      ? '<p>Every bill this month is paid. Nice work.</p>'
      : unpaid.map((b) => `
      <div class="bill-row">
        <div class="grow"><strong>${esc(b.name)}</strong><span>Due ${monthLabel(state.month).split(' ')[0]} ${b.day} &middot; ${b.autopay ? 'autopay' : 'pay by hand'}</span></div>
        <span class="bill-amount">${money(b.amount)}</span>
        <span class="pill due">unpaid</span>
      </div>`).join('')}
    <p><a href="#/bills">All bills &rarr;</a></p>
  </section>

  <section class="card">
    <h2>Latest spending</h2>
    <table>
      <thead><tr><th>Date</th><th>What</th><th class="num">Amount</th></tr></thead>
      <tbody>
      ${recent.map((t) => `
        <tr><td>${shortDate(t.date)}</td>
        <td>${esc(t.payee)}<br><span class="txn-note">${esc(t.note || '')}</span></td>
        <td class="num ${t.amount > 0 ? 'amount-in' : 'amount-out'}">${t.amount > 0 ? '+' : '&minus;'}${money(Math.abs(t.amount)).replace('$', '$')}</td></tr>`).join('')}
      </tbody>
    </table>
    <p><a href="#/transactions">All transactions &rarr;</a></p>
  </section>
</div>`;
}

export function transactions(state, query) {
  const filterCat = query.get('cat') || '';
  const search = (query.get('q') || '').toLowerCase();
  let list = transactionsFor(state, state.month);
  if (filterCat) list = list.filter((t) => t.category === filterCat);
  if (search) list = list.filter((t) => (t.payee + ' ' + (t.note || '')).toLowerCase().includes(search));
  const totals = monthTotals(state, state.month);

  return `
<div class="page-head">
  <div><h1>Transactions</h1><p>${monthLabel(state.month)} &middot; ${list.length} shown &middot;
  ${money(totals.income)} in, ${money(totals.spending)} out</p></div>
  ${monthSwitcher(state)}
</div>

<form class="card" id="add-form" style="margin-top:18px">
  <h2>Add a transaction</h2>
  <div class="form-grid">
    <label>Date <input type="date" name="date" value="${state.month}-26" required></label>
    <label>Payee <input type="text" name="payee" placeholder="e.g. Harvest Market" required maxlength="80"></label>
    <label>Category <select name="category">${categoryOptions('groceries')}</select></label>
    <label>Amount ($) <input type="number" name="amount" step="0.01" min="0.01" placeholder="42.50" required></label>
    <label class="full">Note <input type="text" name="note" placeholder="What was it for?" maxlength="120"></label>
    <label>Direction
      <select name="direction"><option value="out">Money out (spending)</option><option value="in">Money in (income)</option></select>
    </label>
  </div>
  <p style="margin-top:14px"><button class="btn" type="submit">Add transaction</button></p>
</form>

<div class="toolbar">
  <select id="filter-cat" aria-label="Filter by category">
    <option value="">All categories</option>
    ${CATEGORIES.map((c) => `<option value="${c.id}"${c.id === filterCat ? ' selected' : ''}>${c.label}</option>`).join('')}
  </select>
  <input type="text" id="filter-q" placeholder="Search payee or note…" value="${esc(query.get('q') || '')}" aria-label="Search transactions">
</div>

<section class="card">
  ${list.length === 0 ? '<p class="empty">Nothing matches. Try another category or search.</p>' : `
  <table>
    <thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead>
    <tbody>
    ${list.map((t) => `
      <tr><td>${shortDate(t.date)}</td>
      <td>${esc(t.payee)}<br><span class="txn-note">${esc(t.note || '')}</span></td>
      <td><span class="cat-dot" style="background:${categoryColor(t.category)}"></span>${categoryLabel(t.category)}</td>
      <td class="num ${t.amount > 0 ? 'amount-in' : 'amount-out'}">${t.amount > 0 ? '+' : '&minus;'}${money(Math.abs(t.amount))}</td>
      <td class="num"><button class="link-button danger" type="button" data-delete-txn="${t.id}">Delete</button></td></tr>`).join('')}
    </tbody>
  </table>`}
</section>`;
}

export function budgets(state) {
  const rows = budgetStatus(state, state.month);
  const totalLimit = rows.reduce((s, b) => s + b.limit, 0);
  const totalUsed = rows.reduce((s, b) => s + b.used, 0);

  return `
<div class="page-head">
  <div><h1>Budgets</h1><p>${monthLabel(state.month)} &middot; ${money(totalUsed)} of ${money(totalLimit)} planned spending used</p></div>
  ${monthSwitcher(state)}
</div>

<section class="card" style="margin-top:18px">
  <h2>Monthly limits</h2>
  <p>Tap a limit to change it — the bars and the dashboard update at once. Limits are saved in this browser.</p>
  ${rows.map((b) => `
  <div class="budget-row">
    <div class="row-head">
      <strong>${categoryLabel(b.category)}</strong>
      <span>${money(b.used)} of
        <input type="number" min="0" step="10" value="${b.limit}" data-budget-limit="${b.category}"
               aria-label="${categoryLabel(b.category)} monthly limit" style="width:84px;padding:4px 8px">
      </span>
    </div>
    <div class="bar-track"><div class="bar-fill ${b.stateWord === 'over' ? 'over' : b.stateWord === 'near' ? 'near' : ''}" style="width:${Math.min(100, b.pct).toFixed(0)}%"></div></div>
    <p class="stat-note">${b.pct.toFixed(0)}% used &middot;
      ${b.stateWord === 'over' ? `Over by ${money(b.used - b.limit)} — trim something this week.`
        : b.stateWord === 'near' ? `${money(b.limit - b.used)} left. Nearly there.`
        : `${money(b.limit - b.used)} left for the rest of the month.`}
      <span class="pill ${b.stateWord}">${b.stateWord === 'over' ? 'over budget' : b.stateWord === 'near' ? 'almost there' : 'on track'}</span></p>
  </div>`).join('')}
</section>

<section class="card" style="margin-top:16px">
  <h2>How to set a good limit</h2>
  <p>Start from last month's real spending, not from a wish. Groceries run about
  ${money(660)} a month for this household; the ${money(720)} limit leaves room for a holiday shop.
  A limit that is hit every month is not a failure — it is a number that needs raising.</p>
</section>`;
}

export function bills(state) {
  const total = state.bills.reduce((s, b) => s + b.amount, 0);
  const paidTotal = state.bills.filter((b) => b.paid).reduce((s, b) => s + b.amount, 0);
  const sorted = [...state.bills].sort((a, b) => a.day - b.day);

  return `
<div class="page-head">
  <div><h1>Bills</h1><p>${monthLabel(state.month)} &middot; ${money(paidTotal)} of ${money(total)} paid</p></div>
</div>

<section class="card" style="margin-top:18px">
  <h2>Recurring bills</h2>
  <p>Mark a bill paid when the money leaves the account. Autopay bills are marked paid automatically here — flip one back if a payment bounces.</p>
  ${sorted.map((b) => `
  <div class="bill-row">
    <div class="grow"><strong>${esc(b.name)}</strong>
    <span>Due the ${b.day}${b.day === 1 ? 'st' : b.day === 2 ? 'nd' : b.day === 3 ? 'rd' : 'th'} &middot; ${b.autopay ? 'autopay on' : 'manual payment'}</span></div>
    <span class="bill-amount">${money(b.amount)}</span>
    <span class="pill ${b.paid ? 'paid' : 'due'}">${b.paid ? 'paid' : 'unpaid'}</span>
    <button class="btn small ${b.paid ? 'secondary' : ''}" type="button" data-toggle-bill="${b.id}">
      ${b.paid ? 'Mark unpaid' : 'Mark paid'}</button>
  </div>`).join('')}
</section>

<form class="card" id="add-bill-form" style="margin-top:16px">
  <h2>Add a bill</h2>
  <div class="form-grid">
    <label>Bill name <input type="text" name="name" placeholder="e.g. Piano lessons" required maxlength="80"></label>
    <label>Amount ($) <input type="number" name="amount" step="0.01" min="0.01" required></label>
    <label>Day of month <input type="number" name="day" min="1" max="31" value="1" required></label>
    <label>Payment
      <select name="autopay"><option value="false">I pay it by hand</option><option value="true">Autopay</option></select>
    </label>
  </div>
  <p style="margin-top:14px"><button class="btn" type="submit">Add bill</button></p>
</form>`;
}

export function goals(state) {
  const totalSaved = state.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = state.goals.reduce((s, g) => s + g.target, 0);

  return `
<div class="page-head">
  <div><h1>Savings goals</h1><p>${money(totalSaved)} saved toward ${money(totalTarget)} of goals</p></div>
</div>

<section class="card" style="margin-top:18px">
  <h2>What we're saving for</h2>
  ${state.goals.map((g) => {
    const pct = g.target > 0 ? Math.min(100, (g.saved / g.target) * 100) : 0;
    return `
  <div class="goal-row">
    <div class="grow"><strong>${esc(g.name)}</strong><span>${esc(g.note)} &middot; ${money(g.saved)} of ${money(g.target)}</span></div>
    <div class="bar-track"><div class="bar-fill" style="width:${pct.toFixed(0)}%"></div></div>
    <span class="goal-pct">${pct.toFixed(0)}%</span>
    <button class="btn small" type="button" data-add-goal="${g.id}">Add $25</button>
  </div>`;
  }).join('')}
</section>

<form class="card" id="add-goal-form" style="margin-top:16px">
  <h2>Start a new goal</h2>
  <div class="form-grid">
    <label>Goal name <input type="text" name="name" placeholder="e.g. New washing machine" required maxlength="80"></label>
    <label>Target ($) <input type="number" name="target" step="1" min="1" required></label>
    <label class="full">Why this goal? <input type="text" name="note" placeholder="A sentence to keep you going" maxlength="120"></label>
  </div>
  <p style="margin-top:14px"><button class="btn" type="submit">Add goal</button></p>
</form>

<section class="card" style="margin-top:16px">
  <h2>The rule that works for us</h2>
  <p>Payday comes, ${money(250)} moves to savings before anything else is spent. The emergency fund
  gets ${money(150)} of it, the cabin trip ${money(60)}, June's bike ${money(15)} and the car fund ${money(25)}.
  Saving first, spending second — that order is the whole trick.</p>
</section>`;
}

export function reports(state) {
  const months = ['2026-10', '2026-11'];
  const rows = months.map((m) => {
    const t = monthTotals(state, m);
    return { label: monthLabel(m).replace(' 2026', ''), income: t.income, spending: t.spending };
  });
  const totals = monthTotals(state, state.month);
  const spent = spentByCategory(state, state.month);
  const top = Object.entries(spent)
    .map(([cat, value]) => ({ cat, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
  const prev = monthTotals(state, shiftMonth(state.month, -1));
  const change = prev.spending > 0 ? ((totals.spending - prev.spending) / prev.spending) * 100 : 0;
  const biggest = top[0];

  return `
<div class="page-head">
  <div><h1>Monthly report</h1><p>${monthLabel(state.month)} &middot; the numbers, plainly</p></div>
  ${monthSwitcher(state)}
</div>

<div class="grid three" style="margin-top:18px">
  <section class="card">
    <p class="stat-label">Income</p>
    <p class="stat-value good">${money(totals.income)}</p>
    <p class="stat-note">Two salaries plus freelance.</p>
  </section>
  <section class="card">
    <p class="stat-label">Spending</p>
    <p class="stat-value">${money(totals.spending)}</p>
    <p class="stat-note">${change >= 0 ? `${change.toFixed(0)}% more` : `${Math.abs(change).toFixed(0)}% less`} than last month.</p>
  </section>
  <section class="card">
    <p class="stat-label">Savings rate</p>
    <p class="stat-value ${totals.left >= 0 ? 'good' : 'bad'}">${totals.income > 0 ? ((totals.left / totals.income) * 100).toFixed(0) : 0}%</p>
    <p class="stat-note">Share of income kept this month.</p>
  </section>
</div>

<section class="card" style="margin-top:16px">
  <h2>Income vs spending</h2>
  ${monthBars(rows)}
</section>

<div class="grid two" style="margin-top:16px">
  <section class="card">
    <h2>Biggest spending</h2>
    <table>
      <thead><tr><th>Category</th><th class="num">Spent</th><th class="num">Share</th></tr></thead>
      <tbody>
      ${top.map((r) => `
        <tr><td><span class="cat-dot" style="background:${categoryColor(r.cat)}"></span>${categoryLabel(r.cat)}</td>
        <td class="num">${money(r.value)}</td>
        <td class="num">${totals.spending > 0 ? ((r.value / totals.spending) * 100).toFixed(0) : 0}%</td></tr>`).join('')}
      </tbody>
    </table>
  </section>
  <section class="card">
    <h2>In plain words</h2>
    <p>${monthLabel(state.month)}: the household brought in ${money(totals.income)} and spent
    ${money(totals.spending)}, keeping ${money(totals.left)}. ${biggest ? `The biggest cost was
    ${categoryLabel(biggest.cat).toLowerCase()} at ${money(biggest.value)}.` : ''} Rent is fixed at
    ${money(1480)}; the part the household can actually steer is groceries, eating out and fun money —
    about ${money((spent.groceries || 0) + (spent.dining || 0) + (spent.fun || 0))} this month.</p>
    <p><button class="btn secondary" type="button" id="download-csv">Download this month as CSV</button></p>
  </section>
</div>`;
}
