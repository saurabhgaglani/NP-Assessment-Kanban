import { initials, avatarColor } from './lib/members';

const STATUS_DOT = {
  todo: '#94A3B8', inprogress: '#F59E0B', inreview: '#EF4444', done: '#22C55E',
};

export default function BoardPreview({ boardName, columns, tasks, members = [] }) {
  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-border shadow-card-hover overflow-hidden">
        {/* Board title bar */}
        <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
          <span className="font-display text-sm font-semibold text-ink-primary">
            {boardName || 'Your Board'}
          </span>
          {/* Member avatars */}
          {members.length > 0 && (
            <div className="flex items-center -space-x-1.5">
              {members.slice(0, 5).map((m) => (
                <div
                  key={m.id}
                  className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                  style={{ backgroundColor: m.color || avatarColor(m.name) }}
                  title={m.name}
                >
                  {initials(m.name)}
                </div>
              ))}
              {members.length > 5 && (
                <div className="w-6 h-6 rounded-full border-2 border-white bg-surface-column flex items-center justify-center text-[9px] font-medium text-ink-secondary">
                  +{members.length - 5}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Columns */}
        <div className="flex gap-2.5 p-4 overflow-x-auto bg-surface-app">
          {columns.map((col) => (
            <div
              key={col.id}
              className="flex flex-col rounded-xl bg-surface-column border border-border p-2.5 min-w-[110px] w-[110px] shrink-0"
            >
              <div className="flex items-center gap-1.5 mb-2.5">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: STATUS_DOT[col.id] || '#94A3B8' }}
                />
                <span className="text-xs font-semibold text-ink-primary truncate">{col.title}</span>
              </div>

              <div className="flex flex-col gap-1.5">
                {(tasks[col.id] || []).map((t, i) => (
                  <div key={i} className="text-xs text-ink-primary truncate animate-fade-in py-0.5">
                    · {t}
                  </div>
                ))}
                {(tasks[col.id] || []).length === 0 && (
                  <div className="space-y-1.5 opacity-25 pt-0.5">
                    <div className="h-1.5 bg-border rounded-full w-4/5" />
                    <div className="h-1.5 bg-border rounded-full w-3/5" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
