import { useEffect, useState } from 'react';

import { useToast } from '../context/ToastContext';
import api from '../services/api';

const defaultForm = {
  fromAccount: '',
  toAccount: '',
  amount: '',
  date: '',
  description: ''
};

function getReferenceName(value) {
  if (!value) {
    return '-';
  }

  return typeof value === 'object' ? value.name : value;
}

export default function TransfersPage() {
  const { showToast } = useToast();
  const [transfers, setTransfers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function fetchData() {
    setLoading(true);
    try {
      const [transfersResponse, accountsResponse] = await Promise.all([
        api.get('/transactions', { params: { type: 'transfer' } }),
        api.get('/accounts')
      ]);

      setTransfers(transfersResponse.data.transactions);
      setAccounts(accountsResponse.data.accounts);
    } catch (_error) {
      setError('Unable to load transfers');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await api.post('/transactions/transfer', {
        ...formData,
        amount: Number(formData.amount),
        date: formData.date || undefined
      });

      setFormData(defaultForm);
      await fetchData();
      showToast('Transfer completed');
    } catch (submitError) {
      setError(submitError.response?.data?.message || 'Unable to save transfer');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Transfers</p>
          <h1 className="mt-2 text-3xl font-semibold">Move money between accounts with transactional safety</h1>
        </header>

        <section className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">New transfer</h2>
            <div className="mt-5 space-y-4">
              <select
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3"
                value={formData.fromAccount}
                onChange={(event) => setFormData((current) => ({ ...current, fromAccount: event.target.value }))}
              >
                <option value="">Source account</option>
                {accounts.map((account) => (
                  <option key={account._id} value={account._id}>
                    {account.name} ({account.type})
                  </option>
                ))}
              </select>
              <select
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3"
                value={formData.toAccount}
                onChange={(event) => setFormData((current) => ({ ...current, toAccount: event.target.value }))}
              >
                <option value="">Destination account</option>
                {accounts.map((account) => (
                  <option key={account._id} value={account._id}>
                    {account.name} ({account.type})
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3"
                placeholder="Amount"
                value={formData.amount}
                onChange={(event) => setFormData((current) => ({ ...current, amount: event.target.value }))}
              />
              <input
                type="date"
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3"
                value={formData.date}
                onChange={(event) => setFormData((current) => ({ ...current, date: event.target.value }))}
              />
              <textarea
                className="min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3"
                placeholder="Description"
                value={formData.description}
                onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))}
              />
            </div>
            {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
            <button
              type="submit"
              disabled={submitting}
              className="mt-5 rounded-2xl bg-cyan-400 px-4 py-2 font-semibold text-slate-950 disabled:opacity-60"
            >
              {submitting ? 'Transferring...' : 'Transfer funds'}
            </button>
          </form>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Transfer history</h2>
            {loading ? (
              <p className="mt-6 text-slate-300">Loading...</p>
            ) : transfers.length === 0 ? (
              <p className="mt-6 text-slate-300">No transfers recorded yet.</p>
            ) : (
              <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
                <table className="w-full min-w-[800px] text-left text-sm">
                  <thead className="bg-slate-900 text-slate-300">
                    <tr>
                      <th className="px-4 py-3">From</th>
                      <th className="px-4 py-3">To</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transfers.map((transfer) => (
                      <tr key={transfer._id} className="border-t border-white/10">
                        <td className="px-4 py-3">{getReferenceName(transfer.fromAccount)}</td>
                        <td className="px-4 py-3">{getReferenceName(transfer.toAccount)}</td>
                        <td className="px-4 py-3">{Number(transfer.amount).toFixed(2)}</td>
                        <td className="px-4 py-3">{new Date(transfer.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3">{transfer.description || '-'}</td>
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