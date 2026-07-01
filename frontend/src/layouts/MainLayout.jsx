import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const navigationItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard/accounts', label: 'Accounts' },
  { to: '/dashboard/categories', label: 'Categories' },
  { to: '/dashboard/transactions', label: 'Transactions' },
  { to: '/dashboard/transfers', label: 'Transfers' },
  { to: '/dashboard/reports', label: 'Monthly Reports' }
];

export default function MainLayout() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    showToast('Signed out successfully');
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 lg:flex">
      <aside className="border-b border-white/10 bg-slate-950/95 px-5 py-6 lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:px-6 print:hidden">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Finance App</p>
          <h1 className="mt-3 text-2xl font-semibold">Control Center</h1>
          <p className="mt-2 text-sm text-slate-400">Hello, {user?.name}</p>
        </div>

        <nav className="mt-8 flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              className={({ isActive }) =>
                [
                  'rounded-2xl px-4 py-3 text-sm font-medium transition',
                  isActive ? 'bg-cyan-400 text-slate-950' : 'bg-white/5 text-slate-200 hover:bg-white/10'
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/90 px-4 py-4 backdrop-blur lg:px-8 print:hidden">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Secure finance workspace</p>
              <h2 className="text-lg font-semibold">Multi-account management dashboard</h2>
            </div>
            <button onClick={handleLogout} className="rounded-2xl border border-white/10 px-4 py-2 text-sm font-medium hover:bg-white/5">
              Sign out
            </button>
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}