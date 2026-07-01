import { useEffect, useMemo, useState } from 'react';

import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const defaultForm = {
  type: 'income',
  accountId: '',
  categoryId: '',
  amount: '',
  date: '',
  description: ''
};

function getReferenceId(value) {
  if (!value) {
    return '';
  }

  return typeof value === 'object' ? value._id : value;
}

function getReferenceName(value) {
  if (!value) {
    return '-';
  }

  return typeof value === 'object' ? value.name : value;
}

export default function TransactionsPage() {
  const { showToast } = useToast();
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(defaultForm);
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function fetchData() {
    setLoading(true);
    try {
      const [transactionsResponse, accountsResponse, categoriesResponse] = await Promise.all([
        api.get('/transactions'),
        api.get('/accounts'),
        api.get('/categories')
      ]);

      setTransactions(transactionsResponse.data.transactions);
      setAccounts(accountsResponse.data.accounts);
      setCategories(categoriesResponse.data.categories);
    } catch (_error) {
      setError('Unable to load transactions');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const visibleCategories = useMemo(
    () => categories.filter((category) => category.type === formData.type),
    [categories, formData.type]
  );

  function resetForm() {
    setFormData(defaultForm);
    setEditingTransactionId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount),
        categoryId: formData.categoryId || undefined,
        date: formData.date || undefined
      };

      if (editingTransactionId) {
        await api.put(`/transactions/${editingTransactionId}`, payload);
      } else if (payload.type === 'income') {
        await api.post('/transactions/income', payload);
      } else {
        await api.post('/transactions/expense', payload);
      }

      resetForm();
      await fetchData();
      showToast(editingTransactionId ? 'Transaction updated' : 'Transaction created');
    } catch (submitError) {
      setError(submitError.response?.data?.message || 'Unable to save transaction');
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(transaction) {
    setEditingTransactionId(transaction._id);
    setFormData({
      type: transaction.type,
      accountId: getReferenceId(transaction.accountId || transaction.fromAccount),
      categoryId: getReferenceId(transaction.categoryId),
      amount: transaction.amount,
      date: transaction.date ? new Date(transaction.date).toISOString().slice(0, 10) : '',
      description: transaction.description || ''
    });
  }

  async function handleDelete() {
    const transactionId = deleteTarget?._id;
    if (!transactionId) {
      return;
    }

    await api.delete(`/transactions/${transactionId}`);
    showToast('Transaction deleted');
    setDeleteTarget(null);
    await fetchData();
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Transactions</p>
          <h1 className="mt-2 text-3xl font-semibold">Add and manage income and expense history</h1>
        </header>

        <section className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">{editingTransactionId ? 'Edit transaction' : 'New transaction'}</h2>
            <div className="mt-5 space-y-4">
              <select
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3"
                value={formData.type}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, type: event.target.value, categoryId: '' }))
                }
                disabled={Boolean(editingTransactionId)}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <select
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3"
                value={formData.accountId}
                onChange={(event) => setFormData((current) => ({ ...current, accountId: event.target.value }))}
              >
                <option value="">Select account</option>
                {accounts.map((account) => (
                  <option key={account._id} value={account._id}>
                    {account.name} ({account.type})
                  </option>
                ))}
              </select>
              <select
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3"
                value={formData.categoryId}
                onChange={(event) => setFormData((current) => ({ ...current, categoryId: event.target.value }))}
              >
                <option value="">Select category</option>
                {visibleCategories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
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
            <div className="mt-5 flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-2xl bg-cyan-400 px-4 py-2 font-semibold text-slate-950 disabled:opacity-60"
              >
                {submitting ? 'Saving...' : editingTransactionId ? 'Update' : 'Save'}
              </button>
              <button type="button" onClick={resetForm} className="rounded-2xl border border-white/10 px-4 py-2">
                Reset
              </button>
            </div>
          </form>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Transaction history</h2>
            {loading ? (
              <p className="mt-6 text-slate-300">Loading...</p>
            ) : transactions.length === 0 ? (
              <p className="mt-6 text-slate-300">No transactions recorded yet.</p>
            ) : (
              <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="bg-slate-900 text-slate-300">
                    <tr>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Account</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction._id} className="border-t border-white/10">
                        <td className="px-4 py-3 capitalize">{transaction.type}</td>
                        <td className="px-4 py-3">{Number(transaction.amount).toFixed(2)}</td>
                        <td className="px-4 py-3">{getReferenceName(transaction.accountId || transaction.fromAccount)}</td>
                        <td className="px-4 py-3">{getReferenceName(transaction.categoryId)}</td>
                        <td className="px-4 py-3">{new Date(transaction.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3">{transaction.description || '-'}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => startEdit(transaction)} className="rounded-xl border border-white/10 px-3 py-1">
                              Edit
                            </button>
                            <button onClick={() => setDeleteTarget(transaction)} className="rounded-xl border border-red-400/40 px-3 py-1 text-red-300">
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
          title="Delete transaction?"
          description="Deleting this transaction will restore the related account balance automatically."
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      </div>
    </main>
  );
}