import { ImageIcon } from 'lucide-react';
import { useState, type ImgHTMLAttributes } from 'react';

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
  showSkeleton?: boolean;
  /**
   * Aspect ratio sebagai fallback CLS (mis: '16/9', '4/3', '1/1').
   * Override-able via className aspect-* dari Tailwind kalau perlu.
   */
  aspectRatio?: string;
}

/**
 * Image dengan fallback otomatis kalau src error.
 * - Skeleton shimmer saat loading
 * - Fallback ke placeholder gradient kalau gagal
 * - Lazy loading + async decoding by default
 * - CLS-safe dengan aspect ratio
 */
export function SmartImage({
  src,
  alt = '',
  className = '',
  fallback,
  showSkeleton = true,
  aspectRatio,
  loading = 'lazy',
  decoding = 'async',
  ...rest
}: Props) {
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading');

  const aspectStyle = aspectRatio ? { aspectRatio } : undefined;

  if (state === 'error') {
    if (fallback) {
      return <img src={fallback} alt={alt} className={className} loading={loading} decoding={decoding} style={aspectStyle} {...rest} />;
    }
    return (
      <div
        className={`grid place-items-center bg-gradient-to-br from-brand-50 via-cream to-emerald-50 ${className}`}
        role="img"
        aria-label={alt}
        style={aspectStyle}
      >
        <div className="text-center text-brand-600">
          <ImageIcon className="mx-auto h-8 w-8 opacity-60" aria-hidden="true" />
          <p className="mt-1 px-2 text-[11px] font-medium opacity-70 line-clamp-1">{alt || 'Gambar tidak tersedia'}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showSkeleton && state === 'loading' && (
        <div
          className={`absolute inset-0 animate-pulse bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] ${className}`}
          style={{ animationDuration: '1.4s', ...aspectStyle }}
          aria-hidden="true"
        />
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        decoding={decoding}
        onLoad={() => setState('loaded')}
        onError={() => setState('error')}
        style={aspectStyle}
        {...rest}
      />
    </>
  );
}
