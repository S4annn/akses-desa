import { posts as fallback } from '../data/dummyData';
import type { Post, PostType } from '../types/app';
import { emit } from './notificationBus';
import { supabase } from './supabaseClient';
import { getActiveVillage } from './villageService';

const memoryPosts: Post[] = [...fallback];

interface CreatePostInput {
  title: string;
  content: string;
  excerpt: string;
  type: PostType;
  image_url?: string;
  is_published?: boolean;
}

export async function listPublicPosts(): Promise<Post[]> {
  if (!supabase) return memoryPosts;
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });
  if (error || !data) return memoryPosts;
  return data.map(normalize);
}

export async function listAllPosts(): Promise<Post[]> {
  if (!supabase) return memoryPosts;
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return memoryPosts;
  return data.map(normalize);
}

export async function findPostBySlug(slug: string): Promise<Post | null> {
  if (!supabase) return memoryPosts.find((p) => p.slug === slug) ?? null;
  const { data, error } = await supabase.from('posts').select('*').eq('slug', slug).maybeSingle();
  if (error || !data) return null;
  return normalize(data);
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  const slug = generateSlug(input.title);
  const newPost: Post = {
    id: `mem-${Date.now()}`,
    title: input.title,
    slug,
    content: input.content,
    excerpt: input.excerpt,
    type: input.type,
    image_url: input.image_url,
    author: 'Admin Desa',
    published_at: new Date().toISOString(),
  };

  if (!supabase) {
    memoryPosts.unshift(newPost);
    emit('request_created', { type: 'post', title: input.title }); // reuse bus
    return newPost;
  }

  const village = await getActiveVillage();
  const { data, error } = await supabase
    .from('posts')
    .insert({
      village_id: village.id,
      title: input.title,
      slug,
      content: input.content,
      excerpt: input.excerpt,
      type: input.type,
      image_url: input.image_url ?? null,
      is_published: input.is_published ?? true,
      published_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error || !data) {
    memoryPosts.unshift(newPost);
    emit('post_created', { id: newPost.id });
    return newPost;
  }
  emit('post_created', { id: data.id });
  return normalize(data);
}

export async function updatePost(id: string, patch: Partial<CreatePostInput>): Promise<void> {
  if (!supabase) {
    const idx = memoryPosts.findIndex((p) => p.id === id);
    if (idx >= 0) memoryPosts[idx] = { ...memoryPosts[idx], ...patch };
    emit('post_updated', { id });
    return;
  }
  const { error } = await supabase
    .from('posts')
    .update({
      ...(patch.title ? { title: patch.title, slug: generateSlug(patch.title) } : {}),
      ...(patch.content !== undefined ? { content: patch.content } : {}),
      ...(patch.excerpt !== undefined ? { excerpt: patch.excerpt } : {}),
      ...(patch.type ? { type: patch.type } : {}),
      ...(patch.image_url !== undefined ? { image_url: patch.image_url } : {}),
      ...(patch.is_published !== undefined ? { is_published: patch.is_published } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  if (error) throw new Error(error.message);
  emit('post_updated', { id });
}

export async function deletePost(id: string): Promise<void> {
  if (!supabase) {
    const idx = memoryPosts.findIndex((p) => p.id === id);
    if (idx >= 0) memoryPosts.splice(idx, 1);
    emit('post_deleted', { id });
    return;
  }
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw new Error(error.message);
  emit('post_deleted', { id });
}

function normalize(row: Record<string, unknown>): Post {
  return {
    id: String(row.id ?? ''),
    title: String(row.title ?? ''),
    slug: String(row.slug ?? ''),
    content: String(row.content ?? ''),
    excerpt: String(row.excerpt ?? ''),
    type: (row.type as PostType) ?? 'berita',
    image_url: (row.image_url as string) ?? undefined,
    author: (row.author as string) ?? 'Admin Desa',
    published_at: String(row.published_at ?? row.created_at ?? new Date().toISOString()),
  };
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}
