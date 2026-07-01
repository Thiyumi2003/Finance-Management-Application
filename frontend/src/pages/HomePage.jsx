import { Link } from 'react-router-dom';

import homeImage from '../images/home.png';

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden text-slate-100">
      <img
        src={homeImage}
        alt="Finance management background"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-slate-950/70" />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-950/45 to-cyan-950/55" />

      <section className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 lg:px-8">
        <div className="flex items-start justify-center pb-12 pt-2 sm:justify-start">
          <p className="text-sm font-semibold uppercase tracking-[0.45em] text-cyan-200 drop-shadow-lg sm:text-base">
            Finance Management App
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-6 rounded-[2.25rem] border border-white/10 bg-slate-950/35 px-8 py-10 text-center shadow-2xl shadow-black/30 backdrop-blur-md sm:px-12 sm:py-14">
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white drop-shadow-lg sm:text-6xl">
              Simple money control for your daily finances.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-200 drop-shadow-sm sm:text-lg">
              Track accounts, income, expenses, transfers, and monthly reports in one secure place.
            </p>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-2xl bg-cyan-400 px-7 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}