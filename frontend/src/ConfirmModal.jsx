export default function ConfirmModal({ title, message, confirmLabel = 'Confirm', danger = false, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/20 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="w-full max-w-sm bg-white rounded-2xl border border-border shadow-card-drag animate-fade-slide-in p-6">
        <h3 className="font-display text-lg font-bold text-ink-primary mb-2">{title}</h3>
        <p className="text-sm text-ink-secondary leading-relaxed mb-6">{message}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="text-sm font-medium px-4 py-2 rounded-btn border border-border text-ink-secondary hover:bg-surface-column transition-colors btn-press"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`text-sm font-medium px-4 py-2 rounded-btn text-white transition-colors btn-press ${
              danger ? 'bg-red-500 hover:bg-red-600' : 'bg-brand hover:bg-brand-hover'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
