import { galleryItems as fallback } from '../data/dummyData';
import type { GalleryItem } from '../types/app';
import { supabase } from './supabaseClient';
import { getActiveVillage } from './villageService';

const memory: GalleryItem[] = [...fallback];

export async function listGallery(): Promise<GalleryItem[]> {
  if (!supabase) return memory;
  const { data, error } = await supabase
    .from('gallery_items')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return memory;
  return data.map(normalize);
}

export async function createGalleryItem(input: {
  title: string;
  image_url: string;
  category: string;
  description?: string;
}): Promise<GalleryItem> {
  const newItem: GalleryItem = {
    id: `mem-${Date.now()}`,
    title: input.title,
    image_url: input.image_url,
    category: input.category,
    description: input.description,
  };
  if (!supabase) {
    memory.unshift(newItem);
    return newItem;
  }
  const village = await getActiveVillage();
  const { data, error } = await supabase
    .from('gallery_items')
    .insert({ village_id: village.id, ...input })
    .select()
    .single();
  if (error || !data) {
    memory.unshift(newItem);
    return newItem;
  }
  return normalize(data);
}

export async function deleteGalleryItem(id: string): Promise<void> {
  if (!supabase) {
    const idx = memory.findIndex((g) => g.id === id);
    if (idx >= 0) memory.splice(idx, 1);
    return;
  }
  const { error } = await supabase.from('gallery_items').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

function normalize(row: Record<string, unknown>): GalleryItem {
  return {
    id: String(row.id ?? ''),
    title: String(row.title ?? '-'),
    image_url: String(row.image_url ?? ''),
    category: String(row.category ?? 'Umum'),
    description: (row.description as string) ?? undefined,
  };
}
