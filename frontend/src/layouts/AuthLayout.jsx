export default function AuthLayout({ title, description, children }) {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
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