import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Spinner from './components/Spinner';
import MainLayout from './layouts/MainLayout';
import { ToastProvider } from './context/ToastContext';

const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const AccountsPage = lazy(() => import('./pages/AccountsPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const MonthlyReportPage = lazy(() => import('./pages/MonthlyReportPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const TransactionsPage = lazy(() => import('./pages/TransactionsPage'));
const TransfersPage = lazy(() => import('./pages/TransfersPage'));

function PublicRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-slate-200">Loading...</div>;
  }

  return user ? <Navigate to="/" replace /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<Spinner />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="accounts" element={<AccountsPage />} />
                  <Route path="categories" element={<CategoriesPage />} />
                  <Route path="transactions" element={<TransactionsPage />} />
                  <Route path="transfers" element={<TransfersPage />} />
                  <Route path="reports" element={<MonthlyReportPage />} />
                </Route>
              </Route>
              <Route path="*" element={<PublicRedirect />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}