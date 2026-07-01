import { Link } from 'react-router-dom';

export default function AuthLayout({ title, description, children }) {
  return (
    <main className="relative min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <Link
        to="/"
        aria-label="Back to home"
        className="absolute left-4 top-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-lg shadow-black/20 backdrop-blur transition hover:bg-white/15 sm:left-6 sm:top-6"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M5 10.5V20h14v-9.5" />
          <path d="M9 20v-6h6v6" />
        </svg>
      </Link>

      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl shadow-cyan-950/40 lg:grid-cols-2">
        <section className="flex flex-col justify-between bg-gradient-to-br from-cyan-500 via-sky-600 to-slate-900 p-10 text-white">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-100/90">Finance Management</p>
            <h1 className="mt-6 max-w-lg text-4xl font-semibold leading-tight">{title}</h1>
            <p className="mt-4 max-w-md text-base leading-7 text-cyan-50/90">{description}</p>
          </div>
          <div className="mt-12 text-sm text-cyan-50/80">Secure JWT auth, clean architecture, and account-safe operations.</div>
        </section>
        <section className="flex items-center justify-center p-8 sm:p-12">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-xl">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}