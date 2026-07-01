import { useEffect, useState } from 'react';

import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const defaultForm = {
  name: '',
  type: 'wallet',
  balance: 0,
  description: ''
};

export default function AccountsPage() {
  const { showToast } = useToast();
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState(defaultForm);
  const [editingAccountId, setEditingAccountId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function fetchAccounts() {
    setLoading(true);
    try {
      const response = await api.get('/accounts');
      setAccounts(response.data.accounts);
    } catch (_error) {
      setError('Unable to load accounts');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAccounts();
  }, []);

  function resetForm() {
    setFormData(defaultForm);
    setEditingAccountId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (editingAccountId) {
        await api.put(`/accounts/${editingAccountId}`, formData);
      } else {
        await api.post('/accounts', formData);
      }

      resetForm();
      await fetchAccounts();
      showToast(editingAccountId ? 'Account updated' : 'Account created');
    } catch (submitError) {
      setError(submitError.response?.data?.message || 'Unable to save account');
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(account) {
    setEditingAccountId(account._id);
    setFormData({
      name: account.name,
      type: account.type,
      balance: account.balance,
      description: account.description || ''
    });
  }

  async function handleDelete() {
    const accountId = deleteTarget?._id;
    if (!accountId) {
      return;
    }

    await api.delete(`/accounts/${accountId}`);
    showToast('Account deleted');
    setDeleteTarget(null);
    await fetchAccounts();
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Accounts</p>
          <h1 className="mt-2 text-3xl font-semibold">Manage wallets, bank accounts, and business accounts</h1>
        </header>

        <section className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">{editingAccountId ? 'Edit account' : 'Create account'}</h2>
            <div className="mt-5 space-y-4">
              <input
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3"
                placeholder="Account name"
                value={formData.name}
                onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
              />
              <select
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3"
                value={formData.type}
                onChange={(event) => setFormData((current) => ({ ...current, type: event.target.value }))}
              >
                <option value="wallet">Wallet</option>
                <option value="bank">Bank Account</option>
                <option value="business">Business Account</option>
              </select>
              <input
                type="number"
                min="0"
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3"
                placeholder="Current balance"
                value={formData.balance}
                onChange={(event) => setFormData((current) => ({ ...current, balance: Number(event.target.value) }))}
              />
              <textarea
                className="min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3"
                placeholder="Description"
                value={formData.description}
                onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))}
              />
            </div>
            {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
            <div className="mt-5 flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-2xl bg-cyan-400 px-4 py-2 font-semibold text-slate-950 disabled:opacity-60"
              >
                {submitting ? 'Saving...' : editingAccountId ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={resetForm} className="rounded-2xl border border-white/10 px-4 py-2">
                Reset
              </button>
            </div>
          </form>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Your accounts</h2>
            {loading ? (
              <p className="mt-6 text-slate-300">Loading...</p>
            ) : accounts.length === 0 ? (
              <p className="mt-6 text-slate-300">No accounts created yet.</p>
            ) : (
              <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900 text-slate-300">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Balance</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((account) => (
                      <tr key={account._id} className="border-t border-white/10">
                        <td className="px-4 py-3">{account.name}</td>
                        <td className="px-4 py-3 capitalize">{account.type}</td>
                        <td className="px-4 py-3">{account.balance.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => startEdit(account)} className="rounded-xl border border-white/10 px-3 py-1">
                              Edit
                            </button>
                            <button onClick={() => setDeleteTarget(account)} className="rounded-xl border border-red-400/40 px-3 py-1 text-red-300">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <ConfirmModal
          open={Boolean(deleteTarget)}
          title="Delete account?"
          description={`This will remove ${deleteTarget?.name || 'the selected account'} from your workspace.`}
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      </div>
    </main>
  );
}