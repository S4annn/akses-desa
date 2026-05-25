import { knowledgeBase as fallback } from '../data/dummyData';
import type { ChatbotKnowledge } from '../types/app';
import { emit } from './notificationBus';
import { supabase } from './supabaseClient';
import { getActiveVillage } from './villageService';

const memory: ChatbotKnowledge[] = [...fallback];

export async function listActiveKnowledge(): Promise<ChatbotKnowledge[]> {
  if (!supabase) return memory.filter((k) => k.is_active);
  const { data, error } = await supabase
    .from('chatbot_knowledge')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error || !data) return memory.filter((k) => k.is_active);
  return data.map(normalize);
}

export async function listAllKnowledge(): Promise<ChatbotKnowledge[]> {
  if (!supabase) return memory;
  const { data, error } = await supabase
    .from('chatbot_knowledge')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return memory;
  return data.map(normalize);
}

export async function createKnowledge(input: {
  question: string;
  answer: string;
  category: string;
  is_active: boolean;
}): Promise<ChatbotKnowledge> {
  const newItem: ChatbotKnowledge = { id: `mem-${Date.now()}`, ...input };
  if (!supabase) {
    memory.unshift(newItem);
    emit('kb_changed', { id: newItem.id });
    return newItem;
  }
  const village = await getActiveVillage();
  const { data, error } = await supabase
    .from('chatbot_knowledge')
    .insert({ village_id: village.id, ...input })
    .select()
    .single();
  if (error || !data) {
    memory.unshift(newItem);
    emit('kb_changed', { id: newItem.id });
    return newItem;
  }
  emit('kb_changed', { id: data.id });
  return normalize(data);
}

export async function updateKnowledge(
  id: string,
  patch: Partial<{ question: string; answer: string; category: string; is_active: boolean }>
): Promise<void> {
  if (!supabase) {
    const idx = memory.findIndex((k) => k.id === id);
    if (idx >= 0) memory[idx] = { ...memory[idx], ...patch };
    emit('kb_changed', { id });
    return;
  }
  const { error } = await supabase.from('chatbot_knowledge').update(patch).eq('id', id);
  if (error) throw new Error(error.message);
  emit('kb_changed', { id });
}

export async function deleteKnowledge(id: string): Promise<void> {
  if (!supabase) {
    const idx = memory.findIndex((k) => k.id === id);
    if (idx >= 0) memory.splice(idx, 1);
    emit('kb_changed', { id });
    return;
  }
  const { error } = await supabase.from('chatbot_knowledge').delete().eq('id', id);
  if (error) throw new Error(error.message);
  emit('kb_changed', { id });
}

function normalize(row: Record<string, unknown>): ChatbotKnowledge {
  return {
    id: String(row.id ?? ''),
    question: String(row.question ?? ''),
    answer: String(row.answer ?? ''),
    category: String(row.category ?? 'Umum'),
    is_active: Boolean(row.is_active ?? true),
  };
}
