import { useEffect, useState } from 'react';

import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const defaultForm = {
  name: '',
  type: 'income'
};

export default function CategoriesPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(defaultForm);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function fetchCategories() {
    setLoading(true);
    try {
      const response = await api.get('/categories');
      setCategories(response.data.categories);
    } catch (_error) {
      setError('Unable to load categories');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  function resetForm() {
    setFormData(defaultForm);
    setEditingCategoryId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (editingCategoryId) {
        await api.put(`/categories/${editingCategoryId}`, formData);
      } else {
        await api.post('/categories', formData);
      }

      resetForm();
      await fetchCategories();
      showToast(editingCategoryId ? 'Category updated' : 'Category created');
    } catch (submitError) {
      setError(submitError.response?.data?.message || 'Unable to save category');
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(category) {
    setEditingCategoryId(category._id);
    setFormData({ name: category.name, type: category.type });
  }

  async function handleDelete() {
    const categoryId = deleteTarget?._id;
    if (!categoryId) {
      return;
    }

    await api.delete(`/categories/${categoryId}`);
    showToast('Category deleted');
    setDeleteTarget(null);
    await fetchCategories();
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Categories</p>
          <h1 className="mt-2 text-3xl font-semibold">Manage income and expense categories</h1>
        </header>

        <section className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">{editingCategoryId ? 'Edit category' : 'Create category'}</h2>
            <div className="mt-5 space-y-4">
              <input
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3"
                placeholder="Category name"
                value={formData.name}
                onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
              />
              <select
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3"
                value={formData.type}
                onChange={(event) => setFormData((current) => ({ ...current, type: event.target.value }))}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
            <div className="mt-5 flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-2xl bg-cyan-400 px-4 py-2 font-semibold text-slate-950 disabled:opacity-60"
              >
                {submitting ? 'Saving...' : editingCategoryId ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={resetForm} className="rounded-2xl border border-white/10 px-4 py-2">
                Reset
              </button>
            </div>
          </form>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Your categories</h2>
            {loading ? (
              <p className="mt-6 text-slate-300">Loading...</p>
            ) : categories.length === 0 ? (
              <p className="mt-6 text-slate-300">No categories created yet.</p>
            ) : (
              <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900 text-slate-300">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category._id} className="border-t border-white/10">
                        <td className="px-4 py-3">{category.name}</td>
                        <td className="px-4 py-3 capitalize">{category.type}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => startEdit(category)} className="rounded-xl border border-white/10 px-3 py-1">
                              Edit
                            </button>
                            <button onClick={() => setDeleteTarget(category)} className="rounded-xl border border-red-400/40 px-3 py-1 text-red-300">
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
          title="Delete category?"
          description={`This will remove ${deleteTarget?.name || 'the selected category'} from your workspace.`}
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      </div>
    </main>
  );
}