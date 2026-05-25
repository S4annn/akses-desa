import { supabase } from './supabaseClient';
import { village as dummyVillage } from '../data/dummyData';
import type { Village } from '../types/app';

let cachedVillage: Village | null = null;

/**
 * Get the active village. Returns the first village from Supabase, or dummy if not configured.
 * Cached after first call.
 */
export async function getActiveVillage(): Promise<Village> {
  if (cachedVillage) return cachedVillage;

  if (!supabase) {
    cachedVillage = dummyVillage;
    return cachedVillage;
  }

  const { data, error } = await supabase
    .from('villages')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    // eslint-disable-next-line no-console
    console.warn('[Village] fallback to dummy:', error?.message);
    cachedVillage = dummyVillage;
    return cachedVillage;
  }

  cachedVillage = {
    ...dummyVillage,
    ...data,
    latitude: data.latitude != null ? Number(data.latitude) : dummyVillage.latitude,
    longitude: data.longitude != null ? Number(data.longitude) : dummyVillage.longitude,
    mission: parseMission(data.mission),
  } as Village;
  return cachedVillage;
}

function parseMission(value: unknown): string[] {
  if (Array.isArray(value)) return value as string[];
  if (typeof value === 'string') {
    return value
      .split(/\n|;/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export function clearVillageCache() {
  cachedVillage = null;
}
