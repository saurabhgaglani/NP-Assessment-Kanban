import { useState, useCallback } from 'react';
import { initials, avatarColor } from './lib/members';
import TaskModal from './TaskModal';

const PRIORITY_STYLES = {
  high:   { bg: 'bg-red-100 text-red-600',    dot: 'bg-red-400',   label: 'High' },
  normal: { bg: 'bg-amber-100 text-amber-600', dot: 'bg-amber-400', label: 'Medium' },
  low:    { bg: 'bg-green-100 text-green-600', dot: 'bg-green-400', label: 'Low' },
};

export default function TaskCard({ task, columnId, members = [], onDelete, onEdit, onDragStart, onDragEnd, isSettling }) {
  const [hovered, setHovered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleDragStart = useCallback((e) => {
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(task.id, columnId);
  }, [task.id, columnId, onDragStart]);

  const priority = PRIORITY_STYLES[task.priority];
  const assignee = members.find((m) => m.id === task.assigneeId);
  const today = new Date().toISOString().split('T')[0];
  const isOverdue = task.dueDate && task.dueDate < today;

  return (
    <>
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={onDragEnd}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setModalOpen(true)}
        className={`
          relative bg-surface-card border border-border rounded-card p-3.5 cursor-pointer
          card-transition select-none
          ${isSettling ? 'animate-card-settle' : 'animate-fade-slide-in'}
        `}
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)' }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(task.id, columnId); }}
          aria-label="Delete task"
          className={`
            absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center
            text-ink-secondary hover:text-red-500 hover:bg-red-50
            transition-all duration-150 btn-press
            ${hovered ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="1" y1="1" x2="9" y2="9"/><line x1="9" y1="1" x2="1" y2="9"/>
          </svg>
        </button>

        {/* Edit hint — visible on hover */}
        <div className={`absolute bottom-2.5 right-2.5 flex items-center gap-1 text-[10px] text-ink-secondary transition-opacity duration-150 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Edit
        </div>

        <p className="text-sm font-medium text-ink-primary pr-5 leading-snug">{task.title}</p>

        {task.description && (
          <p className="text-xs text-ink-secondary mt-1 leading-snug line-clamp-2">{task.description}</p>
        )}

        {(priority || task.dueDate || assignee) && (
          <div className="flex flex-col gap-1.5 mt-2.5">
            {/* Row 1: priority + assignee */}
            {(priority || assignee) && (
              <div className="flex items-center justify-between">
                {priority ? (
                  <span className={`flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-md ${priority.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
                    {priority.label}
                  </span>
                ) : <span />}
                {assignee && (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                    style={{ backgroundColor: assignee.color || avatarColor(assignee.name) }}
                    title={assignee.name}
                  >
                    {initials(assignee.name)}
                  </div>
                )}
              </div>
            )}
            {/* Row 2: due date always on its own line */}
            {task.dueDate && (
              <span className={`flex items-center gap-1 text-xs font-medium rounded-md px-1.5 py-0.5 w-fit ${
                isOverdue
                  ? 'text-red-600 bg-red-100 border border-red-200'
                  : 'text-brand bg-brand/10 border border-brand/20'
              }`}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                {isOverdue ? `Overdue · ${task.dueDate}` : `Due ${task.dueDate}`}
              </span>
            )}
          </div>
        )}
      </div>

      {modalOpen && (
        <TaskModal
          task={task}
          members={members}
          onSave={onEdit}
          onDelete={onDelete}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
