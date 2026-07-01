import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import api from '../services/api';

import { useAuth } from '../context/AuthContext';

const COLORS = ['#22d3ee', '#60a5fa', '#34d399', '#fbbf24', '#f97316', '#a78bfa'];

function getReferenceName(value) {
  if (!value) {
    return '-';
  }

  return typeof value === 'object' ? value.name : value;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      try {
        const response = await api.get('/reports/dashboard');
        setReport(response.data);
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, []);

  const summaryCards = [
    { label: 'Total Balance', value: report?.totalBalance ?? 0 },
    { label: 'Total Income', value: report?.totalIncome ?? 0 },
    { label: 'Total Expenses', value: report?.totalExpenses ?? 0 },
    { label: 'Accounts', value: report?.accountCount ?? 0 },
    { label: 'Net Savings', value: report?.netSavings ?? 0 }
  ];

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold">Welcome, {user?.name}</h1>
              <p className="mt-2 text-slate-300">Authentication is working. The feature modules will plug into this shell.</p>
            </div>
          </div>
        </header>
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {summaryCards.map((card) => (
            <div key={card.label} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-slate-400">{card.label}</p>
              <p className="mt-3 text-3xl font-semibold">{loading ? '...' : Number(card.value).toFixed(2)}</p>
            </div>
          ))}
        </section>
        <div className="flex flex-wrap gap-3">
          <Link to="/accounts" className="inline-flex rounded-2xl bg-cyan-400 px-4 py-2 font-semibold text-slate-950">
            Manage Accounts
          </Link>
          <Link to="/categories" className="inline-flex rounded-2xl border border-white/10 px-4 py-2 font-semibold text-slate-100">
            Manage Categories
          </Link>
          <Link to="/transactions" className="inline-flex rounded-2xl border border-white/10 px-4 py-2 font-semibold text-slate-100">
            Manage Transactions
          </Link>
          <Link to="/transfers" className="inline-flex rounded-2xl border border-white/10 px-4 py-2 font-semibold text-slate-100">
            Transfers
          </Link>
          <Link to="/reports" className="inline-flex rounded-2xl border border-white/10 px-4 py-2 font-semibold text-slate-100">
            Monthly Reports
          </Link>
        </div>
        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Monthly income vs expense</h2>
            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={report?.monthlyOverview || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="label" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="#22d3ee" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="expense" fill="#f97316" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Expenses by category</h2>
            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={report?.expenseByCategory || []}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                  >
                    {(report?.expenseByCategory || []).map((_entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold">Recent transactions</h2>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="bg-slate-900 text-slate-300">
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
                {(report?.recentTransactions || []).map((transaction) => (
                  <tr key={transaction._id} className="border-t border-white/10">
                    <td className="px-4 py-3 capitalize">{transaction.type}</td>
                    <td className="px-4 py-3">{Number(transaction.amount).toFixed(2)}</td>
                    <td className="px-4 py-3">{getReferenceName(transaction.accountId || transaction.fromAccount)}</td>
                    <td className="px-4 py-3">{getReferenceName(transaction.categoryId)}</td>
                    <td className="px-4 py-3">{new Date(transaction.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{transaction.description || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}