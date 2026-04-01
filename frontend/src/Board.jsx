import { useRef } from 'react';
import Column from './Column';
import AddColumnGhost from './AddColumnGhost';

export default function Board({
  columnDefs, columns, drag, settlingCardId, members,
  onAddTask, onDeleteTask, onEditTask, onAddColumn, onDeleteColumn,
  onDragStart, onDragEnd, onDragOver, onDrop, onReorderColumns,
}) {
  const colDrag = useRef({ from: null, over: null });

  const handleColumnDragStart = (colId) => { colDrag.current.from = colId; };
  const handleColumnDragOver = (colId) => { colDrag.current.over = colId; };
  const handleColumnDrop = (colId) => {
    const { from } = colDrag.current;
    colDrag.current = { from: null, over: null };
    if (!from || from === colId) return;  // not a column drag, ignore
    const next = [...columnDefs];
    const fromIdx = next.findIndex((c) => c.id === from);
    const toIdx = next.findIndex((c) => c.id === colId);
    if (fromIdx === -1 || toIdx === -1) return;
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    onReorderColumns(next);
  };

  return (
    <div className="flex gap-4 p-6 overflow-x-auto min-h-full items-start">
      {columnDefs.map((col, i) => (
        <Column
          key={col.id}
          column={col}
          tasks={columns[col.id] || []}
          index={i}
          isDragOver={drag.overColumn === col.id}
          isColumnDragOver={false}
          settlingCardId={settlingCardId}
          members={members}
          onAddTask={onAddTask}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
          onDeleteColumn={onDeleteColumn}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onColumnDragStart={handleColumnDragStart}
          onColumnDragOver={handleColumnDragOver}
          onColumnDrop={handleColumnDrop}
        />
      ))}
      <AddColumnGhost onAdd={onAddColumn} />
    </div>
  );
}
