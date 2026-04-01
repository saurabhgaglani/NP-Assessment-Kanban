import { useState, useRef, useEffect } from 'react';
import { initials, avatarColor } from './lib/members';

export default function FilterMenu({ members, filters, onFilterChange }) {
  const [open, setOpen] = useState(false);
  const [assigneeHover, setAssigneeHover] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const activeCount = (filters.assigneeId ? 1 : 0) + (filters.overdue ? 1 : 0);

  const toggleAssignee = (id) => {
    onFilterChange({ ...filters, assigneeId: filters.assigneeId === id ? null : id });
    setOpen(false);
  };

  const toggleOverdue = () => {
    onFilterChange({ ...filters, overdue: !filters.overdue });
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-btn border transition-colors btn-press ${
          activeCount > 0
            ? 'bg-brand text-white border-brand'
            : 'border-border text-ink-secondary hover:text-ink-primary'
        }`}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
        </svg>
        Filter{activeCount > 0 ? ` (${activeCount})` : ''}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-border rounded-xl shadow-card-hover z-40 py-1 animate-fade-slide-in">

          {/* Assigned to — cascading */}
          <div
            className="relative"
            onMouseEnter={() => setAssigneeHover(true)}
            onMouseLeave={() => setAssigneeHover(false)}
          >
            <button
              className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-surface-column transition-colors ${
                filters.assigneeId ? 'text-brand font-medium' : 'text-ink-primary'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                Assigned to
              </span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>

            {/* Submenu */}
            {assigneeHover && members.length > 0 && (
              <div className="absolute left-full top-0 ml-1 w-44 bg-white border border-border rounded-xl shadow-card-hover z-50 py-1 animate-fade-in">
                {members.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => toggleAssignee(m.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-surface-column transition-colors ${
                      filters.assigneeId === m.id ? 'text-brand font-medium' : 'text-ink-primary'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                      style={{ backgroundColor: m.color || avatarColor(m.name) }}
                    >
                      {initials(m.name)}
                    </div>
                    <span className="truncate">{m.name}</span>
                    {filters.assigneeId === m.id && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="ml-auto shrink-0">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}

            {members.length === 0 && assigneeHover && (
              <div className="absolute left-full top-0 ml-1 w-44 bg-white border border-border rounded-xl shadow-card-hover z-50 py-3 px-3 animate-fade-in">
                <p className="text-xs text-ink-secondary">No team members yet.</p>
              </div>
            )}
          </div>

          <div className="h-px bg-border mx-2 my-1" />

          {/* Overdue */}
          <button
            onClick={toggleOverdue}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-surface-column transition-colors ${
              filters.overdue ? 'text-red-600 font-medium' : 'text-ink-primary'
            }`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Overdue tasks
            {filters.overdue && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="ml-auto">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
          </button>

          {/* Clear */}
          {activeCount > 0 && (
            <>
              <div className="h-px bg-border mx-2 my-1" />
              <button
                onClick={() => { onFilterChange({ assigneeId: null, overdue: false }); setOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-ink-secondary hover:text-red-500 hover:bg-surface-column transition-colors"
              >
                Clear filters
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
