import { useState } from 'react';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';

const STATUS_DOT = {
  todo: 'bg-status-todo',
  inprogress: 'bg-status-inprogress',
  inreview: 'bg-status-inreview',
  done: 'bg-status-done',
};

export default function Column({
  column, tasks, index, isDragOver, isColumnDragOver, members,
  onAddTask, onDeleteTask, onDeleteColumn, onEditTask,
  onDragStart, onDragEnd, onDragOver, onDrop,
  onColumnDragStart, onColumnDragOver, onColumnDrop,
  settlingCardId,
}) {
  const [adding, setAdding] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => { e.stopPropagation(); onColumnDragStart(column.id); }}
      onDragEnd={(e) => { e.stopPropagation(); }}
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); onDragOver(column.id); onColumnDragOver(column.id); }}
      onDrop={(e) => { e.stopPropagation(); onDrop(column.id); onColumnDrop(column.id); }}
      className={`
        flex flex-col rounded-xl border p-3 min-w-[260px] w-[260px] shrink-0
        transition-colors duration-150 cursor-grab active:cursor-grabbing
        ${isColumnDragOver ? 'border-brand/50 bg-brand/5' : isDragOver ? 'column-drag-over' : 'bg-surface-column border-border'}
      `}
      style={{ animationDelay: `${index * 80}ms`, animation: 'fadeSlideIn 0.35s ease both' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-0.5 group/header">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[column.id] || 'bg-status-todo'}`} />
          <span className="text-sm font-semibold text-ink-primary font-display">{column.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onDeleteColumn(column.id)}
            aria-label="Delete column"
            className="opacity-0 group-hover/header:opacity-100 flex items-center gap-1 text-xs text-ink-secondary hover:text-red-500 hover:bg-red-50 px-2 py-1 rounded-md transition-all duration-150 btn-press"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
            Delete
          </button>
          <span className="text-xs font-medium text-ink-secondary bg-white border border-border rounded-full px-2 py-0.5">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2 flex-1 min-h-[40px]">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            columnId={column.id}
            members={members}
            onDelete={onDeleteTask}
            onEdit={onEditTask}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            isSettling={settlingCardId === task.id}
          />
        ))}
        {isDragOver && (
          <div className="h-16 rounded-card border-2 border-dashed border-brand/30 bg-brand/10" />
        )}
      </div>

      {/* Add task */}
      <div className="mt-3">
        {adding ? (
          <div className="bg-white border border-border rounded-card p-3 animate-fade-slide-in">
            <TaskForm
              members={members}
              onSubmit={(fields) => { onAddTask(column.id, fields); setAdding(false); }}
              onCancel={() => setAdding(false)}
              submitLabel="Add task"
            />
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="w-full flex items-center gap-1.5 text-xs font-medium text-ink-secondary hover:text-ink-primary hover:bg-white rounded-btn px-2 py-2 transition-all duration-150 btn-press"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add task
          </button>
        )}
      </div>
    </div>
  );
}
