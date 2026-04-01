import Column from './Column';
import AddColumnGhost from './AddColumnGhost';

export default function Board({
  columnDefs, columns, drag, settlingCardId, members,
  onAddTask, onDeleteTask, onEditTask, onAddColumn, onDeleteColumn,
  onDragStart, onDragEnd, onDragOver, onDrop,
}) {
  return (
    <div className="flex gap-4 p-6 overflow-x-auto min-h-full items-start">
      {columnDefs.map((col, i) => (
        <Column
          key={col.id}
          column={col}
          tasks={columns[col.id] || []}
          index={i}
          isDragOver={drag.overColumn === col.id}
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
        />
      ))}
      <AddColumnGhost onAdd={onAddColumn} />
    </div>
  );
}
