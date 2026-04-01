import { useState, useCallback, useRef } from 'react';
import BoardPreview from './BoardPreview';
import TaskForm from './TaskForm';
import { avatarColor, initials } from './lib/members';

const DEFAULT_COLUMNS = [
  { id: 'todo', title: 'To Do' },
  { id: 'inprogress', title: 'In Progress' },
  { id: 'inreview', title: 'In Review' },
  { id: 'done', title: 'Done' },
];

const STEPS = [{ num: 1 }, { num: 2 }, { num: 3 }, { num: 4 }, { num: 5 }];

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [animating, setAnimating] = useState(false);
  const [boardName, setBoardName] = useState('');
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [members, setMembers] = useState([]);
  const [previewTasks, setPreviewTasks] = useState({});
  const [fullTasks, setFullTasks] = useState({});

  const goTo = useCallback((next) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => { setStep(next); setAnimating(false); }, 220);
  }, [animating]);

  const handleSkip = () => onComplete({ boardName: boardName || 'My Board', columns, members, initialTasks: fullTasks });
  const handleFinish = () => onComplete({ boardName: boardName || 'My Board', columns, members, initialTasks: fullTasks });

  const handleColumnRename = (id, val) =>
    setColumns((prev) => prev.map((c) => c.id === id ? { ...c, title: val } : c));

  const handleColumnAdd = () => {
    const id = `col_${Date.now()}`;
    setColumns((prev) => [...prev, { id, title: 'New Column' }]);
  };

  const handleColumnDelete = (id) => {
    setColumns((prev) => prev.filter((c) => c.id !== id));
    setPreviewTasks((prev) => { const n = { ...prev }; delete n[id]; return n; });
  };

  const handleAddMember = (name) => {
    if (!name.trim()) return;
    setMembers((prev) => [...prev, { id: `m_${Date.now()}`, name: name.trim(), color: avatarColor(name.trim()) }]);
  };

  const handleRemoveMember = (id) => setMembers((prev) => prev.filter((m) => m.id !== id));

  const handleAddTask = (colId, fields) => {
    const title = (fields?.title || '').trim();
    if (!title) return;
    setPreviewTasks((prev) => {
      const confirmed = [...(prev[`${colId}_confirmed`] || []), title];
      return { ...prev, [colId]: confirmed, [`${colId}_confirmed`]: confirmed };
    });
    setFullTasks((prev) => ({ ...prev, [colId]: [...(prev[colId] || []), fields] }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-app p-6">
      <div className="w-full max-w-6xl bg-white rounded-2xl border border-border shadow-card-hover overflow-hidden flex flex-col md:flex-row min-h-[700px]">

        {/* Left — inputs */}
        <div className="flex flex-col w-full md:w-[42%] p-10 border-r border-border">
          <div className="flex items-center gap-1.5 mb-8">
            {STEPS.map((s) => (
              <div
                key={s.num}
                className={`h-1 rounded-full transition-all duration-300 ${
                  s.num <= step ? 'bg-brand' : 'bg-border'
                } ${s.num === step ? 'flex-[2]' : 'flex-1'}`}
              />
            ))}
          </div>

          <div
            key={step}
            className={`flex-1 ${animating ? 'animate-step-out pointer-events-none' : 'animate-step-in'}`}
          >
            {step === 1 && <StepOne boardName={boardName} onChange={setBoardName} />}
            {step === 2 && (
              <StepTwo
                columns={columns}
                onRename={handleColumnRename}
                onAdd={handleColumnAdd}
                onDelete={handleColumnDelete}
                onReorder={setColumns}
              />
            )}
            {step === 3 && (
              <StepPeople
                members={members}
                onAdd={handleAddMember}
                onRemove={handleRemoveMember}
              />
            )}
            {step === 4 && (
              <StepThree
                columns={columns}
                members={members}
                onAdd={handleAddTask}
                onDone={() => goTo(5)}
                previewTasks={previewTasks}
                fullTasks={fullTasks}
                onDraftTitle={(colId, title) => {
                  setPreviewTasks((prev) => {
                    const confirmed = prev[`${colId}_confirmed`] || [];
                    return { ...prev, [colId]: title.trim() ? [title, ...confirmed] : confirmed };
                  });
                }}
              />
            )}
            {step === 5 && <StepFour boardName={boardName} onFinish={handleFinish} />}
          </div>

          <div className="flex items-center justify-between mt-8">
            <button
              onClick={handleSkip}
              className="text-sm text-ink-secondary hover:text-ink-primary transition-colors btn-press"
            >
              Skip setup
            </button>
            <div className="flex gap-2">
              {step > 1 && (
                <button
                  onClick={() => goTo(step - 1)}
                  className="text-sm font-medium px-4 py-2 rounded-btn border border-border text-ink-primary hover:bg-surface-column transition-colors btn-press"
                >
                  Back
                </button>
              )}
              {step < 5 && step !== 4 && (
                <button
                  onClick={() => goTo(step + 1)}
                  className="text-sm font-medium px-4 py-2 rounded-btn bg-brand text-white hover:bg-brand-hover transition-colors btn-press"
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right — preview */}
        <div className="hidden md:flex flex-1 bg-surface-app">
          <BoardPreview boardName={boardName} columns={columns} tasks={previewTasks} members={members} />
        </div>
      </div>
    </div>
  );
}

function StepOne({ boardName, onChange }) {
  return (
    <div>
      <h2 className="font-display text-3xl font-bold text-ink-primary mb-2">Name your board</h2>
      <p className="text-sm text-ink-secondary mb-6">Give your project a name to get started.</p>
      <input
        autoFocus
        type="text"
        value={boardName}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Product Roadmap"
        className="w-full text-sm px-3 py-2.5 rounded-btn border border-border bg-white text-ink-primary placeholder-ink-secondary focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-shadow"
      />
    </div>
  );
}

function StepTwo({ columns, onRename, onAdd, onDelete, onReorder }) {
  const dragCol = useRef(null);

  const handleDragStart = (id) => { dragCol.current = id; };
  const handleDrop = (targetId) => {
    const from = dragCol.current;
    dragCol.current = null;
    if (!from || from === targetId) return;
    const next = [...columns];
    const fromIdx = next.findIndex((c) => c.id === from);
    const toIdx = next.findIndex((c) => c.id === targetId);
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    onReorder(next);
  };

  return (
    <div>
      <h2 className="font-display text-3xl font-bold text-ink-primary mb-2">Customize columns</h2>
      <p className="text-sm text-ink-secondary mb-5">Rename, reorder, add, or remove columns.</p>
      <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
        {columns.map((col) => (
          <div
            key={col.id}
            draggable
            onDragStart={() => handleDragStart(col.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(col.id)}
            className="flex items-center gap-2 cursor-grab active:cursor-grabbing"
          >
            <svg className="text-ink-secondary shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
            <input
              type="text"
              value={col.title}
              onChange={(e) => onRename(col.id, e.target.value)}
              className="flex-1 text-sm px-3 py-2 rounded-btn border border-border bg-white text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-shadow"
            />
            {columns.length > 1 && (
              <button
                onClick={() => onDelete(col.id)}
                aria-label="Remove column"
                className="w-7 h-7 flex items-center justify-center rounded-md text-ink-secondary hover:text-red-500 hover:bg-red-50 transition-colors btn-press shrink-0"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/>
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={onAdd}
        className="mt-3 flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-hover transition-colors btn-press"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add column
      </button>
    </div>
  );
}

function StepPeople({ members, onAdd, onRemove }) {
  const [draft, setDraft] = useState('');

  const handleAdd = () => {
    if (!draft.trim()) return;
    onAdd(draft.trim());
    setDraft('');
  };

  return (
    <div>
      <h2 className="font-display text-3xl font-bold text-ink-primary mb-2">Add your team</h2>
      <p className="text-sm text-ink-secondary mb-5">Add people so you can assign tasks to them.</p>

      {/* Member list */}
      <div className="flex flex-col gap-2 mb-4">
        {members.map((m) => (
          <div key={m.id} className="flex items-center gap-3 bg-surface-column border border-border rounded-xl px-3 py-2.5 animate-fade-slide-in group">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ backgroundColor: m.color }}
            >
              {initials(m.name)}
            </div>
            <span className="flex-1 text-sm font-medium text-ink-primary">{m.name}</span>
            <button
              onClick={() => onRemove(m.id)}
              className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-md text-ink-secondary hover:text-red-500 hover:bg-red-50 transition-all btn-press"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/>
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          autoFocus
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
          placeholder="e.g. Saurabh"
          className="flex-1 text-sm px-3 py-2.5 rounded-btn border border-border bg-white text-ink-primary placeholder-ink-secondary focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-shadow"
        />
        <button
          onClick={handleAdd}
          className="text-sm font-medium px-4 py-2 rounded-btn bg-brand text-white hover:bg-brand-hover transition-colors btn-press"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function StepThree({ columns, members, onAdd, onDone, previewTasks, fullTasks, onDraftTitle }) {
  const [selectedCol, setSelectedCol] = useState(columns[0]?.id || '');
  const [adding, setAdding] = useState(true);
  const [formKey, setFormKey] = useState(0);

  const colTasks = fullTasks[selectedCol] || [];

  const handleAdd = (fields) => {
    onAdd(selectedCol, fields);
    onDraftTitle(selectedCol, ''); // clear live preview
    setAdding(false);
  };

  const handleAddAnother = () => {
    setFormKey((k) => k + 1);
    setAdding(true);
  };

  const handleColChange = (colId) => {
    onDraftTitle(selectedCol, ''); // clear old col preview
    setSelectedCol(colId);
    setFormKey((k) => k + 1);
    setAdding(true);
  };

  return (
    <div>
      <h2 className="font-display text-3xl font-bold text-ink-primary mb-2">Create & assign tasks</h2>
      <p className="text-sm text-ink-secondary mb-4">Create tasks and assign them to your teammates.</p>

      {/* Column selector */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {columns.map((col) => {
          const count = (previewTasks[col.id] || []).length;
          return (
            <button
              key={col.id}
              type="button"
              onClick={() => { handleColChange(col.id); }}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full border transition-all btn-press ${
                selectedCol === col.id
                  ? 'border-brand bg-brand/10 text-brand font-medium'
                  : 'border-border text-ink-secondary hover:border-brand/40'
              }`}
            >
              {col.title}
              {count > 0 && (
                <span className="bg-brand text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Added tasks */}
      {colTasks.length > 0 && (
        <div className="flex flex-col gap-1.5 mb-3">
          {colTasks.map((t, i) => (
            <div key={i} className="flex items-center gap-2 bg-surface-column border border-border rounded-btn px-3 py-2">
              <span className="text-xs font-medium text-ink-primary flex-1 truncate">{t.title}</span>
              {t.priority && t.priority !== 'normal' && (
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${
                  t.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}>{t.priority}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {adding ? (
        <TaskForm
          key={formKey}
          onSubmit={handleAdd}
          onCancel={() => { onDraftTitle(selectedCol, ''); setAdding(false); }}
          onTitleChange={(val) => onDraftTitle(selectedCol, val)}
          members={members}
          submitLabel="Add task"
        />
      ) : (
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleAddAnother}
            className="flex-1 text-xs font-medium border border-border text-ink-secondary rounded-btn py-2 hover:bg-surface-column transition-colors btn-press"
          >
            + Add another
          </button>
          <button
            onClick={onDone}
            className="flex-1 text-xs font-medium bg-brand text-white rounded-btn py-2 hover:bg-brand-hover transition-colors btn-press"
          >
            Done adding
          </button>
        </div>
      )}
    </div>
  );
}

function StepFour({ boardName, onFinish }) {
  return (
    <div className="flex flex-col items-start">
      <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center mb-5">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F4C81" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <h2 className="font-display text-3xl font-bold text-ink-primary mb-2">You're all set!</h2>
      <p className="text-sm text-ink-secondary mb-8">
        <strong className="text-ink-primary">{boardName || 'Your board'}</strong> is ready. Let's get to work.
      </p>
      <button
        onClick={onFinish}
        className="animate-pulse-cta text-sm font-semibold px-6 py-3 rounded-btn bg-brand text-white hover:bg-brand-hover transition-colors btn-press shadow-card-hover"
      >
        Enter Board →
      </button>
    </div>
  );
}
