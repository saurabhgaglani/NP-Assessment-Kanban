import { useMemo } from 'react';

const PRIORITY_COLORS = {
  high: { bar: 'bg-red-400' },
  normal: { bar: 'bg-amber-400' },
  low: { bar: 'bg-green-400' },
};

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="bg-white border border-border rounded-xl p-5 flex flex-col gap-1">
      <span className="text-xs font-medium text-ink-secondary">{label}</span>
      <span className={`text-3xl font-display font-bold ${accent || 'text-ink-primary'}`}>{value}</span>
      {sub && <span className="text-xs text-ink-secondary">{sub}</span>}
    </div>
  );
}

function Bar({ label, value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-ink-secondary w-24 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-2 bg-surface-column rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-medium text-ink-primary w-6 text-right">{value}</span>
    </div>
  );
}

export default function DashboardPage({ columns, columnDefs, members }) {
  const allTasks = useMemo(() => Object.values(columns).flat(), [columns]);
  const total = allTasks.length;
  const doneColId = useMemo(() => columnDefs.find((c) => c.title.toLowerCase() === 'done')?.id, [columnDefs]);
  const inProgressColId = useMemo(() => columnDefs.find((c) => c.title.toLowerCase().includes('progress'))?.id, [columnDefs]);
  const done = (columns[doneColId] || columns['done'] || []).length;
  const inProgress = (columns[inProgressColId] || columns['inprogress'] || []).length;
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

  // Tasks per member
  const memberTaskCounts = useMemo(() => {
    const counts = {};
    members.forEach((m) => { counts[m.id] = { member: m, total: 0, done: 0 }; });
    allTasks.forEach((t) => {
      if (t.assigneeId && counts[t.assigneeId]) {
        counts[t.assigneeId].total++;
      }
    });
    (columns[doneColId] || columns['done'] || []).forEach((t) => {
      if (t.assigneeId && counts[t.assigneeId]) {
        counts[t.assigneeId].done++;
      }
    });
    return Object.values(counts).sort((a, b) => b.total - a.total);
  }, [allTasks, columns, members, doneColId]);

  // Tasks per priority
  const priorityCounts = useMemo(() => {
    const counts = { high: 0, normal: 0, low: 0 };
    allTasks.forEach((t) => { if (counts[t.priority] !== undefined) counts[t.priority]++; });
    return counts;
  }, [allTasks]);

  // Tasks per column
  const colCounts = useMemo(() =>
    columnDefs.map((col) => ({ ...col, count: (columns[col.id] || []).length })),
    [columnDefs, columns]
  );
  const maxColCount = Math.max(...colCounts.map((c) => c.count), 1);

  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="max-w-4xl">
        <div className="mb-8">
          <h2 className="font-display text-2xl font-bold text-ink-primary">Dashboard</h2>
          <p className="text-sm text-ink-secondary mt-1">Overview of your board's progress.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Tasks" value={total} />
          <StatCard label="Completed" value={done} accent="text-green-600" sub={`${completionRate}% done`} />
          <StatCard label="In Progress" value={inProgress} accent="text-amber-600" />
          <StatCard label="Team Members" value={members.length} />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Tasks by column */}
          <div className="bg-white border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-ink-primary mb-4">Tasks by Column</h3>
            <div className="flex flex-col gap-3">
              {colCounts.map((col) => (
                <Bar key={col.id} label={col.title} value={col.count} max={maxColCount} color="bg-brand" />
              ))}
              {colCounts.length === 0 && <p className="text-xs text-ink-secondary">No columns yet.</p>}
            </div>
          </div>

          {/* Tasks by priority */}
          <div className="bg-white border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-ink-primary mb-4">Tasks by Priority</h3>
            <div className="flex flex-col gap-3">
              {Object.entries(priorityCounts).map(([p, count]) => (
                <Bar key={p} label={p.charAt(0).toUpperCase() + p.slice(1)} value={count} max={total || 1} color={PRIORITY_COLORS[p]?.bar || 'bg-brand'} />
              ))}
            </div>
          </div>
        </div>

        {/* Team performance */}
        {members.length > 0 && (
          <div className="bg-white border border-border rounded-xl p-5 mb-6">
            <h3 className="text-sm font-semibold text-ink-primary mb-4">Team Performance</h3>
            <div className="flex flex-col gap-3">
              {memberTaskCounts.map(({ member, total: t, done: d }) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <span className="text-sm text-ink-primary w-28 shrink-0 truncate">{member.name}</span>
                  <div className="flex-1 h-2 bg-surface-column rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand rounded-full transition-all duration-500"
                      style={{ width: total > 0 ? `${Math.round((t / total) * 100)}%` : '0%' }}
                    />
                  </div>
                  <span className="text-xs text-ink-secondary w-20 text-right shrink-0">
                    {t} tasks · {d} done
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coming soon */}
        <div className="bg-white border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-semibold text-ink-primary">Coming Soon</h3>
            <span className="text-xs font-medium bg-brand/10 text-brand px-2 py-0.5 rounded-full">In Development</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { title: 'Burndown Charts', desc: 'Track velocity and sprint progress over time.' },
              { title: 'Time Tracking', desc: 'Log hours per task and see where time goes.' },
              { title: 'Recurring Tasks', desc: 'Automate repeating work with smart scheduling.' },
            ].map((f) => (
              <div key={f.title} className="border border-dashed border-border rounded-xl p-4 opacity-60">
                <p className="text-sm font-medium text-ink-primary mb-1">{f.title}</p>
                <p className="text-xs text-ink-secondary">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
