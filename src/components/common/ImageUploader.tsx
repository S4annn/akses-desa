import { Image as ImageIcon, Loader2, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { useToast } from '../../hooks/useToast';
import { storageConfig, uploadImage } from '../../services/storageService';

interface Props {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  hint?: string;
  className?: string;
  aspectRatio?: string; // e.g. '16/9', '1/1'
}

/**
 * Reusable image uploader dengan preview.
 * - Drag & drop / click to upload
 * - Auto-upload ke Supabase Storage saat file dipilih
 * - Preview gambar setelah upload
 * - Tombol "Hapus" untuk reset
 */
export function ImageUploader({
  value,
  onChange,
  folder = 'general',
  label = 'Upload gambar',
  hint = `JPG/PNG/WEBP, maks ${storageConfig.maxSizeMB}MB`,
  className = '',
  aspectRatio = '16/9',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { show } = useToast();

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
      show('Gambar berhasil diunggah', 'success');
    } catch (err) {
      show((err as Error).message || 'Gagal upload gambar', 'error');
    } finally {
      setUploading(false);
    }
  }

  function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = ''; // reset agar bisa pilih file yang sama lagi
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  if (value) {
    return (
      <div className={`group relative overflow-hidden rounded-xl border border-slate-200 ${className}`} style={{ aspectRatio }}>
        <img src={value} alt="Preview" className="h-full w-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-slate-900/0 opacity-0 transition group-hover:bg-slate-900/40 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Ganti
          </button>
          <button
            type="button"
            onClick={() => onChange('')}
            className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
          >
            <X className="inline h-3.5 w-3.5" /> Hapus
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={storageConfig.allowedTypes.join(',')}
          className="hidden"
          onChange={onSelect}
        />
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      onClick={() => !uploading && inputRef.current?.click()}
      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition ${
        dragOver
          ? 'border-brand-500 bg-brand-50/50'
          : 'border-slate-200 bg-white hover:border-brand-400 hover:bg-brand-50/30'
      } ${uploading ? 'pointer-events-none opacity-60' : ''} ${className}`}
      style={{ aspectRatio }}
    >
      {uploading ? (
        <>
          <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
          <p className="text-sm font-medium text-slate-700">Mengunggah...</p>
        </>
      ) : (
        <>
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-700">
            <Upload className="h-5 w-5" />
          </span>
          <p className="text-sm font-semibold text-slate-700">{label}</p>
          <p className="text-xs text-slate-500">{hint}</p>
          <p className="text-[11px] text-slate-400">Klik atau seret file ke sini</p>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={storageConfig.allowedTypes.join(',')}
        className="hidden"
        onChange={onSelect}
      />
    </div>
  );
}

/**
 * Variant untuk preview yang lebih kecil (mis. avatar perangkat desa).
 */
export function AvatarUploader({ value, onChange, folder = 'avatars' }: { value?: string; onChange: (url: string) => void; folder?: string }) {
  return (
    <ImageUploader
      value={value}
      onChange={onChange}
      folder={folder}
      label="Upload foto"
      hint="JPG/PNG, square ratio"
      className="!w-32"
      aspectRatio="1/1"
    />
  );
}
