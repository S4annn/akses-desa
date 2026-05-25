import { useEffect, useState } from 'react';
import { brand } from '../../config/branding';
import { getActiveVillage } from '../../services/villageService';

interface Props {
  title: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
}

const DEFAULT_DESCRIPTION =
  'Portal digital desa yang menghubungkan warga dengan layanan administrasi, informasi, dan kegiatan desa.';

/**
 * Update <title> dan <meta> tags secara dinamis per halaman.
 * Site name = nama desa dari Supabase (auto-fetch).
 */
export function Seo({ title, description, image, type = 'website', noIndex }: Props) {
  const [siteName, setSiteName] = useState<string>(brand.name);

  // Fetch nama desa dari Supabase sekali saat mount
  useEffect(() => {
    let mounted = true;
    getActiveVillage()
      .then((v) => {
        if (mounted && v?.name) setSiteName(v.name);
      })
      .catch(() => {
        // keep default brand name
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const fullTitle = title.includes(siteName) ? title : `${title} — ${siteName}`;
    const desc = description ?? DEFAULT_DESCRIPTION;
    document.title = fullTitle;

    setMeta('name', 'description', desc);
    setMeta('name', 'robots', noIndex ? 'noindex,nofollow' : 'index,follow');

    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:site_name', siteName);
    setMeta('property', 'og:url', window.location.href);
    if (image) setMeta('property', 'og:image', image);

    setMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', desc);
    if (image) setMeta('name', 'twitter:image', image);

    setLink('canonical', window.location.origin + window.location.pathname);
  }, [title, description, image, type, noIndex, siteName]);

  return null;
}

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}
