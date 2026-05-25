import { socialAids as fallback } from '../data/dummyData';
import type { SocialAid } from '../types/app';
import { emit } from './notificationBus';
import { supabase } from './supabaseClient';
import { getActiveVillage } from './villageService';

const memory: SocialAid[] = [...fallback];

interface CreateAidInput {
  name: string;
  description: string;
  requirements: string[];
  required_documents: string[];
  period: string;
  status: 'Aktif' | 'Tutup';
}

export async function listActiveAids(): Promise<SocialAid[]> {
  if (!supabase) return memory.filter((s) => s.status === 'Aktif');
  const { data, error } = await supabase
    .from('social_aids')
    .select('*')
    .eq('status', 'Aktif')
    .order('created_at', { ascending: false });
  if (error || !data) return memory.filter((s) => s.status === 'Aktif');
  return data.map(normalize);
}

export async function listAllAids(): Promise<SocialAid[]> {
  if (!supabase) return memory;
  const { data, error } = await supabase
    .from('social_aids')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return memory;
  return data.map(normalize);
}

export async function createAid(input: CreateAidInput): Promise<SocialAid> {
  const newItem: SocialAid = {
    id: `mem-${Date.now()}`,
    ...input,
  };
  if (!supabase) {
    memory.unshift(newItem);
    emit('aid_created', { id: newItem.id });
    return newItem;
  }
  const village = await getActiveVillage();
  const { data, error } = await supabase
    .from('social_aids')
    .insert({
      village_id: village.id,
      ...input,
    })
    .select()
    .single();
  if (error || !data) {
    memory.unshift(newItem);
    emit('aid_created', { id: newItem.id });
    return newItem;
  }
  emit('aid_created', { id: data.id });
  return normalize(data);
}

export async function updateAid(id: string, patch: Partial<CreateAidInput>): Promise<void> {
  if (!supabase) {
    const idx = memory.findIndex((s) => s.id === id);
    if (idx >= 0) memory[idx] = { ...memory[idx], ...patch };
    emit('aid_updated', { id });
    return;
  }
  const { error } = await supabase.from('social_aids').update(patch).eq('id', id);
  if (error) throw new Error(error.message);
  emit('aid_updated', { id });
}

export async function deleteAid(id: string): Promise<void> {
  if (!supabase) {
    const idx = memory.findIndex((s) => s.id === id);
    if (idx >= 0) memory.splice(idx, 1);
    emit('aid_deleted', { id });
    return;
  }
  const { error } = await supabase.from('social_aids').delete().eq('id', id);
  if (error) throw new Error(error.message);
  emit('aid_deleted', { id });
}

export async function submitAidApplication(input: {
  social_aid_id: string;
  citizen_name: string;
  nik: string;
  kk_number: string;
  address: string;
  phone: string;
  family_condition: string;
  estimated_income: number;
  dependents_count: number;
}): Promise<{ tracking_code: string }> {
  const tracking_code = `BNS-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  if (!supabase) return { tracking_code };

  const village = await getActiveVillage();
  const { error } = await supabase.from('aid_applications').insert({
    village_id: village.id,
    social_aid_id: input.social_aid_id,
    tracking_code,
    citizen_name: input.citizen_name,
    nik: input.nik,
    kk_number: input.kk_number,
    address: input.address,
    phone: input.phone,
    family_condition: input.family_condition,
    estimated_income: input.estimated_income,
    dependents_count: input.dependents_count,
    status: 'Diajukan',
  });
  if (error) throw new Error(error.message);
  return { tracking_code };
}

function normalize(row: Record<string, unknown>): SocialAid {
  const reqs = parseArray(row.requirements);
  const docs = parseArray(row.required_documents);
  return {
    id: String(row.id ?? ''),
    name: String(row.name ?? ''),
    description: String(row.description ?? ''),
    requirements: reqs,
    required_documents: docs,
    period: String(row.period ?? '-'),
    status: ((row.status as string) ?? 'Aktif') as 'Aktif' | 'Tutup',
  };
}

function parseArray(value: unknown): string[] {
  if (Array.isArray(value)) return value as string[];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}
