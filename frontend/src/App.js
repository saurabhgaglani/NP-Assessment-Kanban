import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import Sidebar from './Sidebar';
import Board from './Board';
import Onboarding from './Onboarding';
import PeoplePage from './PeoplePage';
import ConfirmModal from './ConfirmModal';
import DashboardPage from './DashboardPage';
import PricingModal from './PricingModal';
import SettingsPage from './SettingsPage';
import FilterMenu from './FilterMenu';
import { ensureGuestSession, supabase } from './lib/supabase';
import { fetchTasks, createTask, deleteTask, moveTask, updateTask } from './lib/tasks';
import { fetchColumns, saveColumns, deleteColumn as deleteColumnDb } from './lib/columns';
import { fetchMembers, createMember, deleteMember } from './lib/members';

const ONBOARDING_KEY = 'kanban_onboarded_v1';
const COLUMN_DEFS_KEY = 'kanban_column_defs_v1';
const BOARD_NAME_KEY = 'kanban_board_name_v1';

const DEFAULT_COLUMN_DEFS = [
  { id: 'todo', title: 'To Do' },
  { id: 'inprogress', title: 'In Progress' },
  { id: 'inreview', title: 'In Review' },
  { id: 'done', title: 'Done' },
];

export default function App() {
  const userRef = useRef(null);
  const [onboarded, setOnboarded] = useState(!!localStorage.getItem(ONBOARDING_KEY));
  const [boardName, setBoardName] = useState(localStorage.getItem(BOARD_NAME_KEY) || 'My Board');
  const [columnDefs, setColumnDefs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(COLUMN_DEFS_KEY)) || DEFAULT_COLUMN_DEFS; }
    catch { return DEFAULT_COLUMN_DEFS; }
  });
  const [columns, setColumns] = useState({ todo: [], inprogress: [], inreview: [], done: [] });
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState('board');

  const drag = useRef({ cardId: null, fromColumn: null, overColumn: null });
  const [dragState, setDragState] = useState({ cardId: null, fromColumn: null, overColumn: null });
  const [settlingCardId, setSettlingCardId] = useState(null);

  useEffect(() => {
    ensureGuestSession()
      .then((u) => {
        userRef.current = u;
        return Promise.all([fetchTasks(), fetchColumns(), fetchMembers()]);
      })
      .then(([grouped, dbCols, memberList]) => {
        setColumns(grouped);
        if (dbCols.length > 0) {
          setColumnDefs(dbCols);
          localStorage.setItem(COLUMN_DEFS_KEY, JSON.stringify(dbCols));
        }
        setMembers(memberList);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Init error:', err);
        setLoading(false);
      });
  }, []);

  const handleOnboardingComplete = useCallback(async ({ boardName: name, columns: defs, members: onboardingMembers = [], initialTasks }) => {
    localStorage.setItem(ONBOARDING_KEY, '1');
    localStorage.setItem(BOARD_NAME_KEY, name);
    localStorage.setItem(COLUMN_DEFS_KEY, JSON.stringify(defs));
    setBoardName(name);
    setColumnDefs(defs);

    // Ensure session is active before any DB writes
    let currentUser = userRef.current;
    if (!currentUser) {
      try {
        currentUser = await ensureGuestSession();
        userRef.current = currentUser;
      } catch (err) {
        console.error('Session error:', err);
        setOnboarded(true);
        return;
      }
    }

    // Save members first, build temp→real ID map for task assignees
    const memberIdMap = {};
    const savedMembers = await Promise.all(
      onboardingMembers.map(async (m) => {
        try {
          const saved = await createMember(m.name, currentUser.id);
          memberIdMap[m.id] = saved.id;
          return saved;
        } catch { return null; }
      })
    );
    setMembers(savedMembers.filter(Boolean));

    // Save columns
    await saveColumns(defs, currentUser.id).catch(console.error);

    // Save tasks with real assignee IDs
    const promises = [];
    defs.forEach((col) => {
      (initialTasks?.[col.id] || []).forEach((task) => {
        const fields = typeof task === 'string' ? { title: task } : task;
        const realAssigneeId = fields.assigneeId ? (memberIdMap[fields.assigneeId] || null) : null;
        promises.push(
          createTask(col.id, {
            title: fields.title,
            description: fields.description || null,
            priority: fields.priority || 'normal',
            due_date: fields.dueDate || null,
            assignee_id: realAssigneeId,
          }, currentUser.id).then((t) => ({ colId: col.id, task: { ...t, assigneeId: realAssigneeId } }))
          .catch(() => null)
        );
      });
    });
    const results = (await Promise.all(promises)).filter(Boolean);
    setColumns((prev) => {
      const next = { ...prev };
      results.forEach(({ colId, task }) => { next[colId] = [...(next[colId] || []), task]; });
      return next;
    });

    setOnboarded(true);
  }, []);

  const handleAddTask = useCallback(async (colId, taskData) => {
    const fields = typeof taskData === 'string' ? { title: taskData } : taskData;
    const tempId = `temp_${Date.now()}`;
    setColumns((prev) => ({
      ...prev,
      [colId]: [...(prev[colId] || []), { id: tempId, ...fields }],
    }));

    const currentUser = userRef.current;
    if (!currentUser) return;

    try {
      const task = await createTask(colId, {
        title: fields.title,
        description: fields.description || null,
        priority: fields.priority || 'normal',
        due_date: fields.dueDate || null,
        assignee_id: fields.assigneeId || null,
      }, currentUser.id);
      const uiTask = { ...task, assigneeId: fields.assigneeId || null };
      setColumns((prev) => ({
        ...prev,
        [colId]: prev[colId].map((t) => t.id === tempId ? uiTask : t),
      }));
    } catch (err) {
      console.error('[kanban] createTask error:', err);
    }
  }, []);

  const handleDeleteTask = useCallback(async (taskId, colId) => {
    setColumns((prev) => ({ ...prev, [colId]: prev[colId].filter((t) => t.id !== taskId) }));
    try { await deleteTask(taskId); }
    catch (err) { console.error('Delete failed:', err); fetchTasks().then(setColumns); }
  }, []);

  const handleEditTask = useCallback(async (taskId, fields) => {
    // Optimistic update across all columns
    setColumns((prev) => {
      const next = {};
      for (const [colId, tasks] of Object.entries(prev)) {
        next[colId] = tasks.map((t) => t.id === taskId ? { ...t, ...fields } : t);
      }
      return next;
    });
    try {
      await updateTask(taskId, {
        title: fields.title,
        description: fields.description,
        priority: fields.priority,
        due_date: fields.dueDate,
        assignee_id: fields.assigneeId,
      });
    } catch (err) {
      console.error('Edit failed:', err);
      fetchTasks().then(setColumns);
    }
  }, []);

  const handleDragStart = useCallback((cardId, fromColumn) => {
    drag.current = { cardId, fromColumn, overColumn: null };
    setDragState({ cardId, fromColumn, overColumn: null });
  }, []);

  const handleDragOver = useCallback((colId) => {
    if (drag.current.overColumn === colId) return;
    drag.current.overColumn = colId;
    setDragState((prev) => ({ ...prev, overColumn: colId }));
  }, []);

  const handleDrop = useCallback(async (toColumn) => {
    const { cardId, fromColumn } = drag.current;
    drag.current = { cardId: null, fromColumn: null, overColumn: null };
    setDragState({ cardId: null, fromColumn: null, overColumn: null });
    if (!cardId || fromColumn === toColumn) return;

    setColumns((prev) => {
      const card = prev[fromColumn]?.find((t) => t.id === cardId);
      if (!card) return prev;
      return {
        ...prev,
        [fromColumn]: prev[fromColumn].filter((t) => t.id !== cardId),
        [toColumn]: [...(prev[toColumn] || []), card],
      };
    });
    setSettlingCardId(cardId);
    setTimeout(() => setSettlingCardId(null), 400);
    try { await moveTask(cardId, toColumn); }
    catch (err) { console.error('Move failed:', err); fetchTasks().then(setColumns); }
  }, []);

  const handleDragEnd = useCallback(() => {
    drag.current = { cardId: null, fromColumn: null, overColumn: null };
    setDragState({ cardId: null, fromColumn: null, overColumn: null });
  }, []);

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [filters, setFilters] = useState({ assigneeId: null, overdue: false });

  const filteredColumns = useMemo(() => {
    if (!filters.assigneeId && !filters.overdue) return columns;
    const today = new Date().toISOString().split('T')[0];
    const result = {};
    Object.entries(columns).forEach(([colId, tasks]) => {
      result[colId] = tasks.filter((t) => {
        if (filters.assigneeId && t.assigneeId !== filters.assigneeId) return false;
        if (filters.overdue && (!t.dueDate || t.dueDate >= today)) return false;
        return true;
      });
    });
    return result;
  }, [columns, filters]);

  const handleReset = useCallback(async () => {
    await Promise.allSettled([
      supabase.from('tasks').delete().eq('user_id', userRef.current?.id),
      supabase.from('columns').delete().eq('user_id', userRef.current?.id),
      supabase.from('team_members').delete().eq('user_id', userRef.current?.id),
    ]);
    localStorage.removeItem(ONBOARDING_KEY);
    localStorage.removeItem(BOARD_NAME_KEY);
    localStorage.removeItem(COLUMN_DEFS_KEY);
    window.location.reload();
  }, []);

  const handleReorderColumns = useCallback((newDefs) => {
    setColumnDefs(newDefs);
    localStorage.setItem(COLUMN_DEFS_KEY, JSON.stringify(newDefs));
    const currentUser = userRef.current;
    if (currentUser) saveColumns(newDefs, currentUser.id).catch(console.error);
  }, []);

  const handleAddColumn = useCallback((title) => {
    const id = `col_${Date.now()}`;
    const newDef = { id, title };
    setColumnDefs((prev) => {
      const next = [...prev, newDef];
      localStorage.setItem(COLUMN_DEFS_KEY, JSON.stringify(next));
      const currentUser = userRef.current;
      if (currentUser) saveColumns(next, currentUser.id).catch(console.error);
      return next;
    });
    setColumns((prev) => ({ ...prev, [id]: [] }));
  }, []);

  const handleDeleteColumn = useCallback(async (colId) => {
    setColumnDefs((prev) => {
      const next = prev.filter((c) => c.id !== colId);
      localStorage.setItem(COLUMN_DEFS_KEY, JSON.stringify(next));
      const currentUser = userRef.current;
      if (currentUser) {
        deleteColumnDb(colId).catch(console.error);
        saveColumns(next, currentUser.id).catch(console.error);
      }
      return next;
    });
    // Tasks in deleted column stay in DB but won't show (orphaned status)
    setColumns((prev) => { const next = { ...prev }; delete next[colId]; return next; });
  }, []);

  const handleAddMember = useCallback(async (name) => {
    const currentUser = userRef.current;
    if (!currentUser) return;
    try {
      const member = await createMember(name, currentUser.id);
      setMembers((prev) => [...prev, member]);
    } catch (err) { console.error('Add member failed:', err); }
  }, []);

  const handleDeleteMember = useCallback(async (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    try { await deleteMember(id); }
    catch (err) { console.error('Delete member failed:', err); fetchMembers().then(setMembers); }
  }, []);

  if (!onboarded) return <Onboarding onComplete={handleOnboardingComplete} />;

  return (
    <div className="flex h-screen overflow-hidden bg-surface-app">
      <div className="hidden md:flex">
        <Sidebar
          boardName={boardName}
          activeNav={activeNav}
          onNavChange={setActiveNav}
          memberCount={members.length}
          onPricingClick={() => setShowPricing(true)}
        />
      </div>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-white shrink-0">
          <div>
            <h1 className="font-display text-lg font-bold text-ink-primary">{boardName}</h1>
            <p className="text-xs text-ink-secondary mt-0.5">
              {loading ? 'Loading…' : `${Object.values(columns).flat().length} tasks`}
            </p>
          </div>
          <div className="flex items-center gap-4 mr-16 mt-4">
            {!loading && activeNav === 'board' && (
              <FilterMenu
                members={members}
                filters={filters}
                onFilterChange={setFilters}
              />
            )}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="text-xs text-ink-secondary hover:text-red-500 border border-border hover:border-red-200 rounded-btn px-3 py-1.5 transition-colors btn-press"
            >
              Reset board
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex gap-4 p-6">
              {columnDefs.map((col) => (
                <div key={col.id} className="flex flex-col rounded-xl border border-border bg-surface-column p-3 min-w-[260px] w-[260px] gap-2">
                  <div className="h-4 w-24 rounded-full shimmer-bg animate-shimmer" />
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-white border border-border rounded-card p-3.5 space-y-2">
                      <div className="h-3 rounded-full shimmer-bg animate-shimmer w-4/5" />
                      <div className="h-3 rounded-full shimmer-bg animate-shimmer w-1/2" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : activeNav === 'people' ? (
            <PeoplePage
              members={members}
              onAdd={handleAddMember}
              onDelete={handleDeleteMember}
            />
          ) : activeNav === 'dashboard' ? (
            <DashboardPage
              columns={columns}
              columnDefs={columnDefs}
              members={members}
            />
          ) : activeNav === 'settings' ? (
            <SettingsPage />
          ) : (
            <Board
              columnDefs={columnDefs}
              columns={filteredColumns}
              drag={dragState}
              settlingCardId={settlingCardId}
              members={members}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
              onAddColumn={handleAddColumn}
              onDeleteColumn={handleDeleteColumn}
              onReorderColumns={handleReorderColumns}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          )}
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-brand border-t border-white/10 flex">
        {['board', 'people', 'settings'].map((id) => (
          <button
            key={id}
            onClick={() => setActiveNav(id)}
            className={`flex-1 py-3 text-xs font-medium capitalize transition-colors btn-press ${activeNav === id ? 'text-white' : 'text-white/60'}`}
          >
            {id}
          </button>
        ))}
      </nav>

      {showResetConfirm && (
        <ConfirmModal
          title="Reset board?"
          message="This will permanently delete all your tasks, columns, and team members. This cannot be undone."
          confirmLabel="Yes, reset everything"
          danger
          onConfirm={handleReset}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}

      {showPricing && <PricingModal onClose={() => setShowPricing(false)} />}
    </div>
  );
}
