import { useState } from 'react';
import { initials, avatarColor } from './lib/members';

export default function PeoplePage({ members, onAdd, onDelete }) {
  const [draft, setDraft] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    if (!draft.trim()) return;
    onAdd(draft.trim());
    setDraft('');
    setAdding(false);
  };

  return (
    <div className="flex-1 overflow-auto p-8 max-w-xl">
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-ink-primary">People</h2>
        <p className="text-sm text-ink-secondary mt-1">
          Add team members to assign tasks to them.
        </p>
      </div>

      {/* Member list */}
      <div className="flex flex-col gap-2 mb-6">
        {members.length === 0 && (
          <p className="text-sm text-ink-secondary py-4 text-center border border-dashed border-border rounded-xl animate-fade-in">
            No team members yet — add one below.
          </p>
        )}
        {members.map((m) => (
          <div
            key={m.id}
            className="flex items-center gap-3 bg-white border border-border rounded-xl px-4 py-3 animate-fade-slide-in group"
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0"
              style={{ backgroundColor: m.color || avatarColor(m.name) }}
            >
              {initials(m.name)}
            </div>
            <span className="flex-1 text-sm font-medium text-ink-primary">{m.name}</span>
            <button
              onClick={() => onDelete(m.id)}
              aria-label="Remove member"
              className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-md text-ink-secondary hover:text-red-500 hover:bg-red-50 transition-all btn-press"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/>
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Add member */}
      {adding ? (
        <div className="flex gap-2 animate-fade-slide-in">
          <input
            autoFocus
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setAdding(false); }}
            placeholder="e.g. Saurabh"
            className="flex-1 text-sm px-3 py-2.5 rounded-btn border border-border bg-white text-ink-primary placeholder-ink-secondary focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-shadow"
          />
          <button
            onClick={handleAdd}
            className="text-sm font-medium px-4 py-2 rounded-btn bg-brand text-white hover:bg-brand-hover transition-colors btn-press"
          >
            Add
          </button>
          <button
            onClick={() => { setAdding(false); setDraft(''); }}
            className="text-sm font-medium px-4 py-2 rounded-btn border border-border text-ink-secondary hover:bg-surface-column transition-colors btn-press"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 text-sm font-medium text-brand hover:text-brand-hover transition-colors btn-press"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add team member
        </button>
      )}
    </div>
  );
}
