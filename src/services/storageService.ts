import { supabase } from './supabaseClient';

const PUBLIC_BUCKET = 'public-images';
const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

/**
 * Upload image ke Supabase Storage bucket "public-images".
 * Return public URL.
 *
 * Fallback (kalau Supabase belum ada): convert ke base64 data URL
 * agar gambar tetap bisa dipakai untuk preview/demo.
 */
export async function uploadImage(file: File, folder = 'general'): Promise<string> {
  // Validasi
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Format file harus JPG, PNG, WEBP, atau GIF.');
  }
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > MAX_SIZE_MB) {
    throw new Error(`Ukuran file maksimal ${MAX_SIZE_MB}MB.`);
  }

  if (!supabase) {
    // Demo mode fallback — pakai data URL
    return await fileToDataURL(file);
  }

  // Generate unique filename
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage.from(PUBLIC_BUCKET).upload(filename, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  });

  if (error) {
    // Fallback ke data URL kalau bucket belum dibuat / RLS error
    console.warn('[Storage] Upload to Supabase failed, fallback to data URL:', error.message);
    return await fileToDataURL(file);
  }

  const { data } = supabase.storage.from(PUBLIC_BUCKET).getPublicUrl(filename);
  return data.publicUrl;
}

function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Gagal membaca file.'));
    reader.readAsDataURL(file);
  });
}

export const storageConfig = {
  maxSizeMB: MAX_SIZE_MB,
  allowedTypes: ALLOWED_TYPES,
  bucket: PUBLIC_BUCKET,
};
