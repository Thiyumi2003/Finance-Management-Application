import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AuthLayout from '../layouts/AuthLayout';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (loginError) {
      setError(loginError.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to manage accounts, transactions, analytics, and monthly reports from one secure dashboard."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none ring-0 transition focus:border-cyan-400"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none ring-0 transition focus:border-cyan-400"
            placeholder="••••••••"
          />
        </div>
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Signing in...' : 'Login'}
        </button>
        <p className="text-sm text-slate-300">
          No account? <Link to="/register" className="text-cyan-300">Create one</Link>
        </p>
      </form>
    </AuthLayout>
  );
}