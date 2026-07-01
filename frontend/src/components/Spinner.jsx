export default function Spinner({ label = 'Loading...' }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/5 px-8 py-10">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-300 border-t-transparent" />
        <p className="text-sm text-slate-300">{label}</p>
      </div>
    </div>
  );
}