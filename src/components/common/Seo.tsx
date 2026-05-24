import { useEffect } from 'react';

interface Props {
  title: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
}

const SITE_NAME = 'AksesDesa';
const DEFAULT_DESCRIPTION =
  'Portal digital desa yang lebih mudah, transparan, dan responsif. Layanan administrasi, pengaduan warga, UMKM, dan AI assistant dalam satu akses.';

/**
 * Update <title> dan <meta> tags secara dinamis per halaman.
 * Lightweight tanpa dependency tambahan (tidak pakai react-helmet).
 */
export function Seo({ title, description, image, type = 'website', noIndex }: Props) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;
    const desc = description ?? DEFAULT_DESCRIPTION;
    document.title = fullTitle;

    setMeta('name', 'description', desc);
    setMeta('name', 'robots', noIndex ? 'noindex,nofollow' : 'index,follow');

    // Open Graph
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:url', window.location.href);
    if (image) setMeta('property', 'og:image', image);

    // Twitter Card
    setMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', desc);
    if (image) setMeta('name', 'twitter:image', image);

    // Canonical
    setLink('canonical', window.location.origin + window.location.pathname);
  }, [title, description, image, type, noIndex]);

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
