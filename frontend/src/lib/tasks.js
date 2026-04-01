import { supabase } from './supabase';

/** Fetch all tasks for the current user, grouped by column id (status = column id) */
export async function fetchTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;

  const grouped = {};
  for (const task of data) {
    const colId = task.status;
    if (!grouped[colId]) grouped[colId] = [];
    grouped[colId].push(dbToUi(task));
  }
  return grouped;
}

export async function createTask(colId, { title, description, priority, due_date, assignee_id }, userId) {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title,
      description: description || null,
      status: colId,
      priority: priority || 'normal',
      due_date: due_date || null,
      assignee_id: assignee_id || null,
      user_id: userId,
    })
    .select()
    .single();
  if (error) throw error;
  return dbToUi(data);
}

export async function moveTask(taskId, toColId) {
  const { error } = await supabase
    .from('tasks')
    .update({ status: toColId })
    .eq('id', taskId);
  if (error) throw error;
}

export async function deleteTask(taskId) {
  const { error } = await supabase.from('tasks').delete().eq('id', taskId);
  if (error) throw error;
}

export async function updateTask(taskId, fields) {
  const dbFields = {};
  if (fields.title !== undefined) dbFields.title = fields.title;
  if (fields.description !== undefined) dbFields.description = fields.description;
  if (fields.priority !== undefined) dbFields.priority = fields.priority;
  if (fields.due_date !== undefined) dbFields.due_date = fields.due_date;
  if (fields.assignee_id !== undefined) dbFields.assignee_id = fields.assignee_id;
  const { error } = await supabase.from('tasks').update(dbFields).eq('id', taskId);
  if (error) throw error;
}

function dbToUi(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    priority: row.priority,
    dueDate: row.due_date,
    assigneeId: row.assignee_id,
    createdAt: row.created_at,
  };
}
