import { supabase } from './supabase';

export async function fetchColumns() {
  const { data, error } = await supabase
    .from('columns')
    .select('*')
    .order('position', { ascending: true });
  if (error) throw error;
  return data.map((c) => ({ id: c.id, title: c.title }));
}

export async function saveColumns(columnDefs, userId) {
  // Upsert all columns with their current positions
  const rows = columnDefs.map((col, i) => ({
    id: col.id,
    title: col.title,
    position: i,
    user_id: userId,
  }));
  const { error } = await supabase
    .from('columns')
    .upsert(rows, { onConflict: 'id' });
  if (error) throw error;
}

export async function deleteColumn(id) {
  const { error } = await supabase.from('columns').delete().eq('id', id);
  if (error) throw error;
}
