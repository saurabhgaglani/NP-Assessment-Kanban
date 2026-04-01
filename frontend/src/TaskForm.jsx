import { useState } from 'react';
import { initials, avatarColor } from './lib/members';

const PRIORITY_OPTIONS = [
  { value: 'high',   label: 'High',   dot: 'bg-red-400',   pill: 'bg-red-100 text-red-600 border-red-200' },
  { value: 'normal', label: 'Medium', dot: 'bg-amber-400', pill: 'bg-amber-100 text-amber-600 border-amber-200' },
  { value: 'low',    label: 'Low',    dot: 'bg-green-400', pill: 'bg-green-100 text-green-600 border-green-200' },
];

const EMPTY = { title: '', description: '', priority: 'normal', assigneeId: '', dueDate: '' };

const today = new Date().toISOString().split('T')[0];
const minDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

export default function TaskForm({ initialValues, onSubmit, onCancel, submitLabel = 'Add task', members = [], onTitleChange }) {
  const [form, setForm] = useState({ ...EMPTY, ...initialValues });

  const set = (field, val) => setForm((prev) => ({ ...prev, [field]: val }));

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim() || null,
      priority: form.priority || 'normal',
      assigneeId: form.assigneeId || null,
      dueDate: form.dueDate || null,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        autoFocus
        type="text"
        value={form.title}
        onChange={(e) => { set('title', e.target.value); onTitleChange?.(e.target.value); }}
        onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); if (e.key === 'Escape') onCancel(); }}
        placeholder="Task title *"
        className="w-full text-sm px-3 py-2.5 rounded-btn border border-border bg-white text-ink-primary placeholder-ink-secondary focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-shadow"
      />

      <textarea
        rows={2}
        value={form.description}
        onChange={(e) => set('description', e.target.value)}
        placeholder="Description (optional)"
        className="w-full text-sm px-3 py-2 rounded-btn border border-border bg-white text-ink-primary placeholder-ink-secondary resize-none focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-shadow"
      />

      <div className="flex gap-1.5">
        {PRIORITY_OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => set('priority', o.value)}
            className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 rounded-btn border transition-all btn-press ${
              form.priority === o.value ? o.pill : 'border-border text-ink-secondary hover:bg-surface-column'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${o.dot}`} />
            {o.label}
          </button>
        ))}
      </div>

      <div>
        <p className="text-xs text-ink-secondary mb-1.5">Due date</p>
        <input
          type="date"
          value={form.dueDate || ''}
          min={minDate}
          onChange={(e) => set('dueDate', e.target.value)}
          className="w-full text-xs px-3 py-2 rounded-btn border border-border bg-white text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-shadow"
        />
      </div>

      {members.length > 0 && (
        <div>
          <p className="text-xs text-ink-secondary mb-1.5">Assign to</p>
          <div className="flex flex-wrap gap-1.5">
            {members.map((m) => {
              const selected = form.assigneeId === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => set('assigneeId', selected ? '' : m.id)}
                  className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border transition-all btn-press ${
                    selected ? 'border-brand bg-brand/10 text-brand font-medium' : 'border-border text-ink-secondary hover:border-brand/40'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                    style={{ backgroundColor: m.color || avatarColor(m.name) }}
                  >
                    {initials(m.name)}
                  </span>
                  {m.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <button
          onClick={handleSubmit}
          className="flex-1 text-xs font-medium bg-brand text-white rounded-btn py-2 hover:bg-brand-hover transition-colors btn-press"
        >
          {submitLabel}
        </button>
        <button
          onClick={onCancel}
          className="flex-1 text-xs font-medium bg-white border border-border text-ink-secondary rounded-btn py-2 hover:bg-surface-column transition-colors btn-press"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
