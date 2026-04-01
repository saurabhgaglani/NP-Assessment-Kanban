import { useState, useRef } from 'react';

export default function AddColumnGhost({ onAdd }) {
  const [active, setActive] = useState(false);
  const [name, setName] = useState('');
  const inputRef = useRef(null);

  const handleConfirm = () => {
    if (!name.trim()) return;
    onAdd(name.trim());
    setName('');
    setActive(false);
  };

  const handleCancel = () => { setName(''); setActive(false); };

  if (!active) {
    return (
      <button
        onClick={() => setActive(true)}
        className="
          flex items-center gap-2 min-w-[220px] w-[220px] shrink-0 h-12
          rounded-xl border-2 border-dashed border-border
          text-sm font-medium text-ink-secondary
          hover:border-brand/40 hover:text-brand hover:bg-brand/10
          transition-all duration-200 px-4 btn-press self-start
        "
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add column
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2 min-w-[220px] w-[220px] shrink-0 bg-surface-column border border-border rounded-xl p-3 self-start animate-fade-slide-in">
      <input
        ref={inputRef}
        autoFocus
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') handleConfirm(); if (e.key === 'Escape') handleCancel(); }}
        placeholder="Column name..."
        className="w-full text-sm px-3 py-2 rounded-btn border border-border bg-white text-ink-primary placeholder-ink-secondary focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-shadow"
      />
      <div className="flex gap-2">
        <button
          onClick={handleConfirm}
          className="flex-1 text-xs font-medium bg-brand text-white rounded-btn py-1.5 hover:bg-brand-hover transition-colors btn-press"
        >
          Add
        </button>
        <button
          onClick={handleCancel}
          className="flex-1 text-xs font-medium bg-white border border-border text-ink-secondary rounded-btn py-1.5 hover:bg-white/80 transition-colors btn-press"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
