# HearthLedger
[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/yuyan5319-crypto/makefun-best-household-budget-site-20261126-1457-fresh/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/yuyan5319-crypto/makefun-best-household-budget-site-20261126-1457-fresh/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

HearthLedger is a household budget site for one family — the Aldens — kept in plain
static files. It shows a month at a glance (money in, money out, what's left), budgets
by category with progress bars, a transactions list you can add to, search and filter,
recurring bills you can mark paid, savings goals you can feed, and a monthly report
with income-vs-spending bars and a CSV download. Everything is stored in the browser's
localStorage; nothing leaves the machine and nothing is loaded over the network.

## How to run it

Serve `app/` with any static file server, for example:

```sh
cd app && python3 -m http.server 8080
```

Then open http://localhost:8080 — it works on desktop and on a phone.

## Layout

- `app/index.html` — the shell: header, navigation, footer, one `<main>` the views fill.
- `app/style.css` — the whole look: warm paper palette, cards, bars, phone layout.
- `app/data.js` — the Alden household's seed figures (November and October 2026).
- `app/state.js` — localStorage persistence and the month/category math.
- `app/views.js` — one render function per page: dashboard, transactions, budgets, bills, goals, reports.
- `app/charts.js` — hand-rolled SVG donut and bar charts, no libraries.
- `app/app.js` — hash router and every control's handler.
- `main.ts` — the hand-in program: copies `app/` and `screenshots/` to the output
  directory and writes `dossier.json` with the vendored make.fun library.
- `screenshots/` — real renders of this site running in a browser.
