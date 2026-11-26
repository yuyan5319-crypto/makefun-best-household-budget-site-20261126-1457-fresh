// App shell: hash router, state wiring, and every control's handler.
// Routes: #/ dashboard, #/transactions, #/budgets, #/bills, #/goals, #/reports.
// Query strings on a route (e.g. #/transactions?cat=groceries) drive the filters.

import { loadState, saveState, resetState, nextId, shiftMonth, money } from './state.js';
import { dashboard, transactions, budgets, bills, goals, reports } from './views.js';

let state = loadState();
const view = document.getElementById('view');

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [path, queryString] = raw.split('?');
  return { path: path || '', query: new URLSearchParams(queryString || '') };
}

function render() {
  const { path, query } = parseHash();
  const pages = { '': dashboard, transactions, budgets, bills, goals, reports };
  const page = pages[path] || dashboard;
  view.innerHTML = page(state, query);
  document.querySelectorAll('[data-nav]').forEach((a) => {
    const name = a.getAttribute('data-nav');
    a.classList.toggle('active', (path || 'dashboard') === name);
  });
  wireControls(query);
}

function rerender() {
  saveState(state);
  render();
}

function go(path) {
  location.hash = '#/' + path;
}

function wireControls(query) {
  // Month switcher (dashboard, transactions, budgets, reports).
  view.querySelectorAll('[data-month-shift]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.month = shiftMonth(state.month, Number(btn.getAttribute('data-month-shift')));
      rerender();
    });
  });

  // Add a transaction.
  const addForm = view.querySelector('#add-form');
  if (addForm) {
    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = new FormData(addForm);
      const amount = Math.abs(Number(form.get('amount')));
      if (!amount || amount <= 0) return;
      const signed = form.get('direction') === 'in' ? amount : -amount;
      state.transactions.push({
        id: nextId('t'),
        date: String(form.get('date')),
        payee: String(form.get('payee')).trim(),
        category: String(form.get('category')),
        amount: signed,
        note: String(form.get('note') || '').trim(),
      });
      state.month = String(form.get('date')).slice(0, 7);
      rerender();
    });
  }

  // Delete a transaction.
  view.querySelectorAll('[data-delete-txn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.transactions = state.transactions.filter((t) => t.id !== btn.getAttribute('data-delete-txn'));
      rerender();
    });
  });

  // Transaction filters.
  const filterCat = view.querySelector('#filter-cat');
  if (filterCat) {
    filterCat.addEventListener('change', () => {
      const q = new URLSearchParams();
      if (filterCat.value) q.set('cat', filterCat.value);
      if (query.get('q')) q.set('q', query.get('q'));
      go('transactions' + (q.toString() ? '?' + q.toString() : ''));
    });
  }
  const filterQ = view.querySelector('#filter-q');
  if (filterQ) {
    filterQ.addEventListener('input', () => {
      const q = new URLSearchParams();
      if (query.get('cat')) q.set('cat', query.get('cat'));
      if (filterQ.value.trim()) q.set('q', filterQ.value.trim());
      history.replaceState(null, '', '#/transactions' + (q.toString() ? '?' + q.toString() : ''));
      render();
      const again = view.querySelector('#filter-q');
      if (again) { again.focus(); again.setSelectionRange(again.value.length, again.value.length); }
    });
  }

  // Edit a budget limit.
  view.querySelectorAll('[data-budget-limit]').forEach((input) => {
    input.addEventListener('change', () => {
      const cat = input.getAttribute('data-budget-limit');
      const limit = Math.max(0, Number(input.value) || 0);
      const row = state.budgets.find((b) => b.category === cat);
      if (row) row.limit = limit;
      rerender();
    });
  });

  // Toggle a bill paid / unpaid.
  view.querySelectorAll('[data-toggle-bill]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const bill = state.bills.find((b) => b.id === btn.getAttribute('data-toggle-bill'));
      if (bill) bill.paid = !bill.paid;
      rerender();
    });
  });

  // Add a bill.
  const billForm = view.querySelector('#add-bill-form');
  if (billForm) {
    billForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = new FormData(billForm);
      state.bills.push({
        id: nextId('bill'),
        name: String(form.get('name')).trim(),
        amount: Math.abs(Number(form.get('amount'))),
        day: Math.min(31, Math.max(1, Number(form.get('day')) || 1)),
        autopay: form.get('autopay') === 'true',
        paid: false,
      });
      rerender();
    });
  }

  // Add $25 to a savings goal.
  view.querySelectorAll('[data-add-goal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const goal = state.goals.find((g) => g.id === btn.getAttribute('data-add-goal'));
      if (goal) goal.saved = Math.min(goal.target, goal.saved + 25);
      rerender();
    });
  });

  // Add a savings goal.
  const goalForm = view.querySelector('#add-goal-form');
  if (goalForm) {
    goalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = new FormData(goalForm);
      state.goals.push({
        id: nextId('goal'),
        name: String(form.get('name')).trim(),
        target: Math.abs(Number(form.get('target'))),
        saved: 0,
        note: String(form.get('note') || '').trim() || 'A new goal.',
      });
      rerender();
    });
  }

  // Download the month's transactions as CSV.
  const csvBtn = view.querySelector('#download-csv');
  if (csvBtn) {
    csvBtn.addEventListener('click', () => {
      const rows = state.transactions
        .filter((t) => t.date.slice(0, 7) === state.month)
        .sort((a, b) => (a.date < b.date ? -1 : 1));
      const escCsv = (s) => `"${String(s).replace(/"/g, '""')}"`;
      const lines = ['date,payee,category,amount,note'].concat(rows.map((t) =>
        [t.date, escCsv(t.payee), t.category, t.amount.toFixed(2), escCsv(t.note || '')].join(',')));
      const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `hearthledger-${state.month}.csv`;
      a.click();
      URL.revokeObjectURL(a.href);
    });
  }
}

// Reset demo data (footer).
document.getElementById('reset-demo').addEventListener('click', () => {
  state = resetState();
  rerender();
});

window.addEventListener('hashchange', render);
render();
