import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import TaskForm from './TaskForm';

export default function TaskModal({ task, members, onSave, onDelete, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/20 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl border border-border shadow-card-drag animate-fade-slide-in overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-display text-base font-bold text-ink-primary">Edit Task</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { onDelete(task.id); onClose(); }}
              className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-btn transition-colors btn-press"
            >
              Delete
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-md text-ink-secondary hover:bg-surface-column transition-colors btn-press"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="px-5 py-4">
          <TaskForm
            initialValues={{
              title: task.title || '',
              description: task.description || '',
              priority: task.priority || 'normal',
              dueDate: task.dueDate || '',
              assigneeId: task.assigneeId || '',
            }}
            members={members}
            onSubmit={(fields) => { onSave(task.id, fields); onClose(); }}
            onCancel={onClose}
            submitLabel="Save changes"
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
