import { useEffect, useState } from 'react';

import api from '../services/api';

const currentDate = new Date();

const defaultFilters = {
  month: String(currentDate.getMonth() + 1).padStart(2, '0'),
  year: String(currentDate.getFullYear())
};

function getReferenceName(value) {
  if (!value) {
    return '-';
  }

  return typeof value === 'object' ? value.name : value;
}

export default function MonthlyReportPage() {
  const [filters, setFilters] = useState(defaultFilters);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchReport(activeFilters = filters) {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/reports/monthly', {
        params: { month: Number(activeFilters.month), year: Number(activeFilters.year) }
      });

      setReport(response.data);
    } catch (_error) {
      setError('Unable to load monthly report');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReport();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    await fetchReport(filters);
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100 print:bg-white print:p-0 print:text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6 print:max-w-none print:space-y-0">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-6 print:hidden">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Monthly Reports</p>
          <h1 className="mt-2 text-3xl font-semibold">Filter income, expense, and savings by month</h1>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 print:hidden">
          <select
            className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3"
            value={filters.month}
            onChange={(event) => setFilters((current) => ({ ...current, month: event.target.value }))}
          >
            {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
              <option key={month} value={String(month).padStart(2, '0')}>
                {new Date(2000, month - 1, 1).toLocaleString('en-US', { month: 'long' })}
              </option>
            ))}
          </select>
          <input
            type="number"
            className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3"
            value={filters.year}
            onChange={(event) => setFilters((current) => ({ ...current, year: event.target.value }))}
          />
          <button type="submit" className="rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950">
            View report
          </button>
          <button type="button" onClick={() => window.print()} className="rounded-2xl border border-white/10 px-4 py-3">
            Download PDF
          </button>
        </form>

        {error ? <div className="rounded-3xl border border-red-400/30 bg-red-500/10 p-4 text-red-200">{error}</div> : null}

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-900 shadow-sm print:rounded-none print:border-0 print:shadow-none">
          <div className="flex flex-col gap-6 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-700">Monthly Financial Report</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                {new Date(Number(filters.year), Number(filters.month) - 1, 1).toLocaleString('en-US', {
                  month: 'long',
                  year: 'numeric'
                })}
              </h2>
              <p className="mt-2 text-sm text-slate-500">Generated from your transaction history and account balances.</p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-right text-sm">
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-slate-500">Income</p>
                <p className="mt-1 text-lg font-semibold text-emerald-700">{loading ? '...' : Number(report?.incomeTotal ?? 0).toFixed(2)}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-slate-500">Expenses</p>
                <p className="mt-1 text-lg font-semibold text-rose-700">{loading ? '...' : Number(report?.expenseTotal ?? 0).toFixed(2)}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-slate-500">Savings</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{loading ? '...' : Number(report?.savings ?? 0).toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3 print:gap-3">
            {[
              { label: 'Income Total', value: report?.incomeTotal ?? 0, accent: 'text-emerald-700' },
              { label: 'Expense Total', value: report?.expenseTotal ?? 0, accent: 'text-rose-700' },
              { label: 'Savings', value: report?.savings ?? 0, accent: 'text-cyan-700' }
            ].map((card) => (
              <div key={card.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 print:rounded-2xl">
                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                <p className={`mt-3 text-3xl font-semibold ${card.accent}`}>{loading ? '...' : Number(card.value).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-slate-950">Transactions</h3>
            {loading ? (
              <p className="mt-4 text-slate-500">Loading...</p>
            ) : (report?.transactions || []).length === 0 ? (
              <p className="mt-4 text-slate-500">No transactions found for this month.</p>
            ) : (
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 text-slate-600">
                    <tr>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Account</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(report?.transactions || []).map((transaction, index) => (
                      <tr key={transaction._id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="px-4 py-3 capitalize">{transaction.type}</td>
                        <td className="px-4 py-3 font-medium">{Number(transaction.amount).toFixed(2)}</td>
                        <td className="px-4 py-3">{getReferenceName(transaction.accountId || transaction.fromAccount)}</td>
                        <td className="px-4 py-3">{getReferenceName(transaction.categoryId)}</td>
                        <td className="px-4 py-3">{new Date(transaction.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3">{transaction.description || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}