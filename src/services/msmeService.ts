import { msmes as initial } from '../data/dummyData';
import type { MSME } from '../types/app';
import { emit } from './notificationBus';
import { supabase } from './supabaseClient';
import { getActiveVillage } from './villageService';

// In-memory store yang shared antara halaman publik & admin
const memoryMsmes: MSME[] = [...initial];

interface RegisterMSMEInput {
  business_name: string;
  owner_name: string;
  category: string;
  description: string;
  phone: string;
  address: string;
  image_url?: string;
}

export async function listPublicMSMEs(): Promise<MSME[]> {
  if (!supabase) return memoryMsmes.filter((m) => m.is_verified);
  const { data, error } = await supabase
    .from('msmes')
    .select('*')
    .eq('is_active', true)
    .eq('is_verified', true)
    .order('created_at', { ascending: false });
  if (error || !data) return memoryMsmes.filter((m) => m.is_verified);
  return data.map(normalize);
}

export async function listAllMSMEs(): Promise<MSME[]> {
  if (!supabase) return memoryMsmes;
  const { data, error } = await supabase
    .from('msmes')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return memoryMsmes;
  return data.map(normalize);
}

export async function registerMSME(input: RegisterMSMEInput): Promise<MSME> {
  const newMsme: MSME = {
    id: `mem-${Date.now()}`,
    business_name: input.business_name,
    owner_name: input.owner_name,
    category: input.category,
    description: input.description,
    phone: input.phone,
    address: input.address,
    image_url: input.image_url,
    is_verified: false, // butuh verifikasi admin dulu
  };

  if (!supabase) {
    memoryMsmes.unshift(newMsme);
    emit('msme_created', { name: input.business_name });
    return newMsme;
  }

  const village = await getActiveVillage();
  const { data, error } = await supabase
    .from('msmes')
    .insert({
      village_id: village.id,
      business_name: input.business_name,
      owner_name: input.owner_name,
      category: input.category,
      description: input.description,
      phone: input.phone,
      address: input.address,
      image_url: input.image_url ?? null,
      is_verified: false,
      is_active: true,
    })
    .select()
    .single();

  if (error || !data) {
    memoryMsmes.unshift(newMsme);
    emit('msme_created', { name: input.business_name });
    return newMsme;
  }
  emit('msme_created', { name: input.business_name });
  return { ...newMsme, id: String(data.id) };
}

export async function toggleMSMEVerification(id: string, verified: boolean): Promise<void> {
  if (!supabase) {
    const idx = memoryMsmes.findIndex((m) => m.id === id);
    if (idx >= 0) memoryMsmes[idx] = { ...memoryMsmes[idx], is_verified: verified };
    emit('msme_updated', { id });
    return;
  }
  const { error } = await supabase.from('msmes').update({ is_verified: verified }).eq('id', id);
  if (error) throw new Error(error.message);
  emit('msme_updated', { id });
}

export async function deactivateMSME(id: string): Promise<void> {
  if (!supabase) {
    const idx = memoryMsmes.findIndex((m) => m.id === id);
    if (idx >= 0) memoryMsmes.splice(idx, 1);
    emit('msme_deleted', { id });
    return;
  }
  const { error } = await supabase.from('msmes').update({ is_active: false }).eq('id', id);
  if (error) throw new Error(error.message);
  emit('msme_deleted', { id });
}

export async function deleteMSME(id: string): Promise<void> {
  if (!supabase) {
    const idx = memoryMsmes.findIndex((m) => m.id === id);
    if (idx >= 0) memoryMsmes.splice(idx, 1);
    emit('msme_deleted', { id });
    return;
  }
  const { error, count } = await supabase
    .from('msmes')
    .delete({ count: 'exact' })
    .eq('id', id);

  if (error) {
    console.error('[MSME] Delete failed:', error);
    throw new Error(error.message || 'Gagal menghapus UMKM');
  }
  if (count === 0) {
    console.warn('[MSME] Delete returned 0 rows — kemungkinan RLS DELETE policy belum di-apply');
    throw new Error(
      'UMKM tidak dapat dihapus. Pastikan RLS policy "msmes admin delete" sudah di-apply di Supabase.'
    );
  }
  emit('msme_deleted', { id });
}

function normalize(row: Record<string, unknown>): MSME {
  return {
    id: String(row.id ?? ''),
    business_name: String(row.business_name ?? ''),
    owner_name: String(row.owner_name ?? ''),
    category: String(row.category ?? 'Lainnya'),
    description: String(row.description ?? ''),
    phone: String(row.phone ?? ''),
    address: String(row.address ?? ''),
    image_url: (row.image_url as string) ?? undefined,
    opening_hours: (row.opening_hours as string) ?? undefined,
    is_verified: Boolean(row.is_verified),
  };
}

export async function updateMSME(
  id: string,
  patch: Partial<{
    business_name: string;
    owner_name: string;
    category: string;
    description: string;
    phone: string;
    address: string;
    image_url: string;
    opening_hours: string;
  }>
): Promise<void> {
  if (!supabase) {
    const idx = memoryMsmes.findIndex((m) => m.id === id);
    if (idx >= 0) memoryMsmes[idx] = { ...memoryMsmes[idx], ...patch };
    emit('msme_updated', { id });
    return;
  }
  const { error, count } = await supabase
    .from('msmes')
    .update(patch, { count: 'exact' })
    .eq('id', id);
  if (error) {
    console.error('[MSME] Update failed:', error);
    throw new Error(error.message || 'Gagal update UMKM');
  }
  if (count === 0) {
    throw new Error(
      'UMKM tidak dapat diupdate. Pastikan RLS policy "msmes admin update" sudah di-apply di Supabase.'
    );
  }
  emit('msme_updated', { id });
}
