import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AuthLayout from '../layouts/AuthLayout';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (registerError) {
      setError(registerError.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Create your financial workspace"
      description="Register to manage wallets, bank accounts, business accounts, income, expenses, and transfer history."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none ring-0 transition focus:border-cyan-400"
            placeholder="Your name"
          />
        </div>
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
            placeholder="At least 6 characters"
          />
        </div>
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Creating account...' : 'Register'}
        </button>
        <p className="text-sm text-slate-300">
          Already have an account? <Link to="/login" className="text-cyan-300">Login</Link>
        </p>
      </form>
    </AuthLayout>
  );
}