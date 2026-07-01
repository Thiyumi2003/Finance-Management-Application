export default function ConfirmModal({ open, title, description, confirmLabel = 'Confirm', onConfirm, onCancel }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl shadow-black/50">
        <h3 className="text-2xl font-semibold text-white">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-2xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-200">
            Cancel
          </button>
          <button onClick={onConfirm} className="rounded-2xl bg-red-400 px-4 py-2 text-sm font-semibold text-slate-950">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}