// Seed data for HearthLedger: the Alden household (two adults, one child, one dog),
// November 2026 with October 2026 for comparison. All figures are invented demo
// figures in US dollars; nothing here is a real person's money.

export const HOUSEHOLD = {
  name: 'The Alden household',
  members: 'Mara & Tom Alden, June (7), and Biscuit the dog',
  currency: 'USD',
  month: '2026-11',
};

export const CATEGORIES = [
  { id: 'groceries', label: 'Groceries', color: '#3f7a52' },
  { id: 'housing', label: 'Housing', color: '#3d6b8e' },
  { id: 'transport', label: 'Transport', color: '#a97b12' },
  { id: 'dining', label: 'Eating out', color: '#b4552d' },
  { id: 'utilities', label: 'Utilities', color: '#6a5a8e' },
  { id: 'health', label: 'Health', color: '#2e7d6b' },
  { id: 'kids', label: 'Kids & school', color: '#8e5a7a' },
  { id: 'fun', label: 'Fun & treats', color: '#c28a2e' },
  { id: 'income', label: 'Income', color: '#3f7a52' },
  { id: 'other', label: 'Other', color: '#8a8378' },
];

export const BUDGETS = [
  { category: 'groceries', limit: 720 },
  { category: 'housing', limit: 1480 },
  { category: 'transport', limit: 260 },
  { category: 'dining', limit: 220 },
  { category: 'utilities', limit: 310 },
  { category: 'health', limit: 180 },
  { category: 'kids', limit: 240 },
  { category: 'fun', limit: 150 },
];

export const BILLS = [
  { id: 'bill-rent', name: 'Rent — Maple Court apartment', amount: 1480, day: 1, autopay: true, paid: true },
  { id: 'bill-electric', name: 'Electric — City Power', amount: 96, day: 8, autopay: true, paid: true },
  { id: 'bill-internet', name: 'Internet — NorthLink fiber', amount: 65, day: 12, autopay: true, paid: true },
  { id: 'bill-water', name: 'Water & sewer', amount: 58, day: 15, autopay: false, paid: true },
  { id: 'bill-phone', name: 'Phones — two lines', amount: 84, day: 18, autopay: true, paid: false },
  { id: 'bill-insurance', name: 'Car insurance', amount: 132, day: 22, autopay: true, paid: false },
  { id: 'bill-gym', name: 'Gym — Riverside Fitness', amount: 46, day: 25, autopay: false, paid: false },
  { id: 'bill-streaming', name: 'Streaming bundle', amount: 23, day: 28, autopay: true, paid: false },
];

export const GOALS = [
  { id: 'goal-emergency', name: 'Emergency fund', target: 6000, saved: 4280, note: 'Six months of rent, slowly.' },
  { id: 'goal-holiday', name: 'Summer cabin trip', target: 1800, saved: 1150, note: 'A week by the lake in July.' },
  { id: 'goal-bike', name: "June's new bike", target: 320, saved: 210, note: 'Birthday in March — she wants purple.' },
  { id: 'goal-car', name: 'Replace the old sedan', target: 9000, saved: 1740, note: 'Saving $250 a month toward it.' },
];

// amount: positive = money in, negative = money out. date is ISO, category matches CATEGORIES.
export const TRANSACTIONS = [
  // November 2026
  { id: 't-nov-01', date: '2026-11-01', payee: 'Northgate Payroll — Mara', category: 'income', amount: 2650, note: 'Monthly salary' },
  { id: 't-nov-02', date: '2026-11-01', payee: 'Maple Court Properties', category: 'housing', amount: -1480, note: 'November rent' },
  { id: 't-nov-03', date: '2026-11-02', payee: 'Harvest Market', category: 'groceries', amount: -142.60, note: 'Weekly shop' },
  { id: 't-nov-04', date: '2026-11-03', payee: 'City Power', category: 'utilities', amount: -96, note: 'October usage' },
  { id: 't-nov-05', date: '2026-11-04', payee: 'Corner Bakery', category: 'dining', amount: -18.40, note: 'Breakfast with June' },
  { id: 't-nov-06', date: '2026-11-05', payee: 'Fuel — QuickStop', category: 'transport', amount: -41.20, note: 'Full tank' },
  { id: 't-nov-07', date: '2026-11-06', payee: 'Bright Smiles Dentist', category: 'health', amount: -75, note: "June's check-up" },
  { id: 't-nov-08', date: '2026-11-07', payee: 'Harvest Market', category: 'groceries', amount: -118.35, note: 'Weekly shop' },
  { id: 't-nov-09', date: '2026-11-08', payee: 'Pasta House', category: 'dining', amount: -52.80, note: 'Family dinner' },
  { id: 't-nov-10', date: '2026-11-09', payee: 'School — art supplies', category: 'kids', amount: -34.50, note: 'Paint set for class' },
  { id: 't-nov-11', date: '2026-11-10', payee: 'Northgate Payroll — Tom', category: 'income', amount: 2140, note: 'Monthly salary' },
  { id: 't-nov-12', date: '2026-11-11', payee: 'NorthLink fiber', category: 'utilities', amount: -65, note: 'November internet' },
  { id: 't-nov-13', date: '2026-11-12', payee: 'PetCo', category: 'other', amount: -28.90, note: 'Dog food for Biscuit' },
  { id: 't-nov-14', date: '2026-11-13', payee: 'Harvest Market', category: 'groceries', amount: -96.10, note: 'Weekly shop' },
  { id: 't-nov-15', date: '2026-11-14', payee: 'Cinema — Riverside', category: 'fun', amount: -36, note: 'Saturday film, three tickets' },
  { id: 't-nov-16', date: '2026-11-15', payee: 'Water & Sewer Dept', category: 'utilities', amount: -58, note: 'Quarterly bill' },
  { id: 't-nov-17', date: '2026-11-16', payee: 'Fuel — QuickStop', category: 'transport', amount: -38.75, note: 'Half tank' },
  { id: 't-nov-18', date: '2026-11-17', payee: 'Pharmacy — Green Cross', category: 'health', amount: -22.40, note: 'Prescription refill' },
  { id: 't-nov-19', date: '2026-11-18', payee: 'Harvest Market', category: 'groceries', amount: -131.45, note: 'Weekly shop + Thanksgiving bits' },
  { id: 't-nov-20', date: '2026-11-19', payee: 'Bookshop — Chapter One', category: 'kids', amount: -24.95, note: "June's birthday book" },
  { id: 't-nov-21', date: '2026-11-20', payee: 'Noodle Bar', category: 'dining', amount: -44.60, note: 'Takeaway Friday' },
  { id: 't-nov-22', date: '2026-11-21', payee: 'Harvest Market', category: 'groceries', amount: -87.20, note: 'Weekly shop' },
  { id: 't-nov-23', date: '2026-11-22', payee: 'Bus passes — Tom', category: 'transport', amount: -52, note: 'Monthly commuter pass' },
  { id: 't-nov-24', date: '2026-11-23', payee: 'Freelance — Mara (design)', category: 'income', amount: 380, note: 'Weekend logo job' },
  { id: 't-nov-25', date: '2026-11-24', payee: 'Toy Store — Playhouse', category: 'fun', amount: -41.30, note: 'Board game for family night' },
  { id: 't-nov-26', date: '2026-11-25', payee: 'Harvest Market', category: 'groceries', amount: -154.75, note: 'Thanksgiving shop' },
  { id: 't-nov-27', date: '2026-11-26', payee: 'Thanksgiving dinner — potluck', category: 'dining', amount: -29.90, note: 'Pie and cider' },
  // October 2026 (for month switching and reports)
  { id: 't-oct-01', date: '2026-10-01', payee: 'Northgate Payroll — Mara', category: 'income', amount: 2650, note: 'Monthly salary' },
  { id: 't-oct-02', date: '2026-10-01', payee: 'Maple Court Properties', category: 'housing', amount: -1480, note: 'October rent' },
  { id: 't-oct-03', date: '2026-10-03', payee: 'Harvest Market', category: 'groceries', amount: -128.40, note: 'Weekly shop' },
  { id: 't-oct-04', date: '2026-10-05', payee: 'City Power', category: 'utilities', amount: -88, note: 'September usage' },
  { id: 't-oct-05', date: '2026-10-06', payee: 'Fuel — QuickStop', category: 'transport', amount: -44.10, note: 'Full tank' },
  { id: 't-oct-06', date: '2026-10-08', payee: 'Harvest Market', category: 'groceries', amount: -141.20, note: 'Weekly shop' },
  { id: 't-oct-07', date: '2026-10-10', payee: 'Northgate Payroll — Tom', category: 'income', amount: 2140, note: 'Monthly salary' },
  { id: 't-oct-08', date: '2026-10-11', payee: 'School — field trip', category: 'kids', amount: -45, note: 'Farm visit' },
  { id: 't-oct-09', date: '2026-10-12', payee: 'NorthLink fiber', category: 'utilities', amount: -65, note: 'October internet' },
  { id: 't-oct-10', date: '2026-10-14', payee: 'Harvest Market', category: 'groceries', amount: -109.85, note: 'Weekly shop' },
  { id: 't-oct-11', date: '2026-10-15', payee: 'Water & Sewer Dept', category: 'utilities', amount: -54, note: 'Quarterly bill' },
  { id: 't-oct-12', date: '2026-10-17', payee: 'Pasta House', category: 'dining', amount: -61.20, note: 'Family dinner' },
  { id: 't-oct-13', date: '2026-10-19', payee: 'Pharmacy — Green Cross', category: 'health', amount: -31.75, note: 'Allergy medicine' },
  { id: 't-oct-14', date: '2026-10-21', payee: 'Harvest Market', category: 'groceries', amount: -122.60, note: 'Weekly shop' },
  { id: 't-oct-15', date: '2026-10-23', payee: 'Cinema — Riverside', category: 'fun', amount: -28, note: 'Film night' },
  { id: 't-oct-16', date: '2026-10-25', payee: 'Fuel — QuickStop', category: 'transport', amount: -39.60, note: 'Half tank' },
  { id: 't-oct-17', date: '2026-10-28', payee: 'Harvest Market', category: 'groceries', amount: -133.90, note: 'Weekly shop' },
  { id: 't-oct-18', date: '2026-10-30', payee: 'Bookshop — Chapter One', category: 'kids', amount: -19.80, note: 'Story books' },
];
