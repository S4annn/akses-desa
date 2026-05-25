import { agendas as fallback } from '../data/dummyData';
import type { Agenda } from '../types/app';
import { supabase } from './supabaseClient';
import { getActiveVillage } from './villageService';

const memory: Agenda[] = [...fallback];

interface CreateAgendaInput {
  title: string;
  description: string;
  location: string;
  category: string;
  start_date: string;
  end_date?: string;
}

export async function listAgendas(): Promise<Agenda[]> {
  if (!supabase) return memory;
  const { data, error } = await supabase
    .from('agendas')
    .select('*')
    .order('start_date', { ascending: true });
  if (error || !data) return memory;
  return data.map(normalize);
}

export async function createAgenda(input: CreateAgendaInput): Promise<Agenda> {
  const newItem: Agenda = {
    id: `mem-${Date.now()}`,
    title: input.title,
    description: input.description,
    location: input.location,
    category: input.category,
    start_date: input.start_date,
    end_date: input.end_date,
  };

  if (!supabase) {
    memory.unshift(newItem);
    return newItem;
  }
  const village = await getActiveVillage();
  const { data, error } = await supabase
    .from('agendas')
    .insert({
      village_id: village.id,
      title: input.title,
      description: input.description,
      location: input.location,
      category: input.category,
      start_date: input.start_date,
      end_date: input.end_date ?? null,
    })
    .select()
    .single();
  if (error || !data) {
    memory.unshift(newItem);
    return newItem;
  }
  return normalize(data);
}

export async function updateAgenda(id: string, patch: Partial<CreateAgendaInput>): Promise<void> {
  if (!supabase) {
    const idx = memory.findIndex((a) => a.id === id);
    if (idx >= 0) memory[idx] = { ...memory[idx], ...patch };
    return;
  }
  const { error } = await supabase.from('agendas').update(patch).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteAgenda(id: string): Promise<void> {
  if (!supabase) {
    const idx = memory.findIndex((a) => a.id === id);
    if (idx >= 0) memory.splice(idx, 1);
    return;
  }
  const { error } = await supabase.from('agendas').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

function normalize(row: Record<string, unknown>): Agenda {
  return {
    id: String(row.id ?? ''),
    title: String(row.title ?? ''),
    description: String(row.description ?? ''),
    location: String(row.location ?? ''),
    category: String(row.category ?? 'Umum'),
    start_date: String(row.start_date ?? new Date().toISOString()),
    end_date: (row.end_date as string) ?? undefined,
  };
}
