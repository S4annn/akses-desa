import { budgetItems as fallback } from '../data/dummyData';
import type { BudgetItem } from '../types/app';
import { supabase } from './supabaseClient';
import { getActiveVillage } from './villageService';

const memory: BudgetItem[] = [...fallback];

export async function listBudgetItems(year?: number): Promise<BudgetItem[]> {
  if (!supabase) {
    return year ? memory.filter((b) => b.year === year) : memory;
  }
  const q = supabase.from('budget_items').select('*').order('category', { ascending: true });
  if (year) q.eq('year', year);
  const { data, error } = await q;
  if (error || !data) return year ? memory.filter((b) => b.year === year) : memory;
  return data.map(normalize);
}

export async function createBudgetItem(input: {
  year: number;
  category: string;
  title: string;
  allocated_amount: number;
  realized_amount: number;
  description?: string;
}): Promise<BudgetItem> {
  const newItem: BudgetItem = { id: `mem-${Date.now()}`, ...input };
  if (!supabase) {
    memory.unshift(newItem);
    return newItem;
  }
  const village = await getActiveVillage();
  const { data, error } = await supabase
    .from('budget_items')
    .insert({ village_id: village.id, ...input })
    .select()
    .single();
  if (error || !data) {
    memory.unshift(newItem);
    return newItem;
  }
  return normalize(data);
}

export async function updateBudgetItem(
  id: string,
  patch: Partial<{ category: string; title: string; allocated_amount: number; realized_amount: number; description: string }>
): Promise<void> {
  if (!supabase) {
    const idx = memory.findIndex((b) => b.id === id);
    if (idx >= 0) memory[idx] = { ...memory[idx], ...patch };
    return;
  }
  const { error } = await supabase.from('budget_items').update(patch).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteBudgetItem(id: string): Promise<void> {
  if (!supabase) {
    const idx = memory.findIndex((b) => b.id === id);
    if (idx >= 0) memory.splice(idx, 1);
    return;
  }
  const { error } = await supabase.from('budget_items').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

function normalize(row: Record<string, unknown>): BudgetItem {
  return {
    id: String(row.id ?? ''),
    year: Number(row.year ?? new Date().getFullYear()),
    category: String(row.category ?? 'Umum'),
    title: String(row.title ?? ''),
    allocated_amount: Number(row.allocated_amount ?? 0),
    realized_amount: Number(row.realized_amount ?? 0),
    description: (row.description as string) ?? undefined,
  };
}
