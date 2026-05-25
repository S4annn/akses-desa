import { supabase } from './supabaseClient';

const PUBLIC_BUCKET = 'public-images';
const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];

/**
 * Upload image ke Supabase Storage bucket "public-images".
 * Return public URL.
 *
 * Fallback (kalau Supabase belum ada / bucket gagal): convert ke base64 data URL.
 */
export async function uploadImage(file: File, folder = 'general'): Promise<string> {
  // Validasi format
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Format file tidak didukung. Format yang diizinkan: JPG, PNG, WEBP, GIF.`);
  }

  // Validasi ukuran
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > MAX_SIZE_MB) {
    throw new Error(`Ukuran file ${sizeMB.toFixed(1)}MB melebihi batas ${MAX_SIZE_MB}MB.`);
  }

  // Mode demo (no Supabase) — pakai base64 data URL
  if (!supabase) {
    console.info('[Storage] Supabase tidak terkonfigurasi, fallback ke data URL');
    return await fileToDataURL(file);
  }

  // Generate unique filename
  const ext = (file.name.split('.').pop() ?? 'jpg').toLowerCase();
  const safeName = file.name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(0, 40);
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;

  console.info(`[Storage] Mengunggah ke bucket "${PUBLIC_BUCKET}" path "${filename}"...`);

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(PUBLIC_BUCKET)
    .upload(filename, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    console.error('[Storage] Upload gagal:', uploadError);

    // Detect bucket missing
    if (
      uploadError.message.toLowerCase().includes('bucket not found') ||
      uploadError.message.toLowerCase().includes('not found')
    ) {
      console.warn('[Storage] Bucket "public-images" belum dibuat, fallback ke data URL');
      return await fileToDataURL(file);
    }

    // Detect RLS / permission
    if (
      uploadError.message.toLowerCase().includes('rls') ||
      uploadError.message.toLowerCase().includes('policy') ||
      uploadError.message.toLowerCase().includes('unauthorized') ||
      uploadError.message.toLowerCase().includes('403')
    ) {
      console.warn('[Storage] RLS policy menolak upload, fallback ke data URL.');
      console.warn('         Setup di Supabase: Storage → public-images → Policies → tambahkan INSERT policy untuk anon');
      return await fileToDataURL(file);
    }

    // Fallback umum
    return await fileToDataURL(file);
  }

  console.info('[Storage] Upload sukses:', uploadData.path);

  const { data: publicData } = supabase.storage.from(PUBLIC_BUCKET).getPublicUrl(uploadData.path);
  if (!publicData?.publicUrl) {
    console.warn('[Storage] Gagal mendapatkan public URL, fallback ke data URL');
    return await fileToDataURL(file);
  }

  return publicData.publicUrl;
}

function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Gagal membaca file. Coba file lain.'));
    reader.readAsDataURL(file);
  });
}

export const storageConfig = {
  maxSizeMB: MAX_SIZE_MB,
  allowedTypes: ALLOWED_TYPES,
  bucket: PUBLIC_BUCKET,
};
