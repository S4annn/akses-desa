import { officials as fallback } from '../data/dummyData';
import type { VillageOfficial } from '../types/app';
import { supabase } from './supabaseClient';

const memory: VillageOfficial[] = [...fallback];

export async function listOfficials(): Promise<VillageOfficial[]> {
  if (!supabase) return memory;
  const { data, error } = await supabase
    .from('village_officials')
    .select('*')
    .order('order_index', { ascending: true });
  if (error || !data) return memory;
  return data.map(
    (row): VillageOfficial => ({
      id: String(row.id),
      name: String(row.name ?? ''),
      position: String(row.position ?? ''),
      photo_url: (row.photo_url as string) ?? undefined,
    })
  );
}
