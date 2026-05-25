import L from 'leaflet';
import { useEffect, useMemo, useRef } from 'react';

// Fix default marker icons (Leaflet bug with bundlers)
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

export interface MapMarker {
  id: string | number;
  lat: number;
  lng: number;
  /** Warna marker (hex). Default: brand teal */
  color?: string;
  popupTitle?: string;
  popupBody?: string;
}

interface Props {
  /** Center coordinate (default: marker pertama atau koordinat desa) */
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  /** Tinggi peta. Default: full height parent */
  className?: string;
  /** Disable scroll-wheel zoom (cocok untuk preview di-embed) */
  scrollWheelZoom?: boolean;
  /** Tile provider. Default: OpenStreetMap */
  tileLayer?: 'osm' | 'satellite';
}

/**
 * Real interactive map menggunakan Leaflet + OpenStreetMap.
 * - Gratis, tanpa API key
 * - Marker dengan custom warna untuk highlight kategori pengaduan
 * - Auto-fit bounds kalau multiple marker
 */
export function RealMap({
  center,
  zoom = 14,
  markers = [],
  className = 'h-full w-full',
  scrollWheelZoom = true,
  tileLayer = 'osm',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Default center: pakai marker pertama, atau Sleman DIY sebagai fallback
  const effectiveCenter = useMemo<[number, number]>(() => {
    if (center) return center;
    if (markers.length > 0) return [markers[0].lat, markers[0].lng];
    return [-7.7956, 110.3695]; // Sleman, DIY
  }, [center, markers]);

  // Init map sekali
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: effectiveCenter,
      zoom,
      scrollWheelZoom,
      zoomControl: true,
      attributionControl: true,
    });

    const tileUrl =
      tileLayer === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const attribution =
      tileLayer === 'satellite'
        ? 'Tiles &copy; Esri'
        : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

    L.tileLayer(tileUrl, { attribution, maxZoom: 19 }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update markers saat berubah
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Hapus semua marker existing (TileLayer di-skip)
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    if (markers.length === 0) {
      map.setView(effectiveCenter, zoom);
      return;
    }

    // Tambah marker
    const bounds = L.latLngBounds([]);
    markers.forEach((m) => {
      const color = m.color ?? '#0F766E';
      const icon = L.divIcon({
        html: `
          <div style="position:relative;">
            <div style="
              position:absolute; left:50%; top:50%;
              width:32px; height:32px; transform:translate(-50%,-50%);
              background:${color}33; border-radius:50%;
              animation: pulse 2s ease-in-out infinite;
            "></div>
            <div style="
              position:relative; width:18px; height:18px;
              background:${color}; border:3px solid white; border-radius:50%;
              box-shadow:0 2px 6px rgba(0,0,0,.3);
            "></div>
          </div>
        `,
        className: 'custom-marker',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });
      const marker = L.marker([m.lat, m.lng], { icon }).addTo(map);
      if (m.popupTitle || m.popupBody) {
        marker.bindPopup(
          `<div style="font-family:'Plus Jakarta Sans',system-ui,sans-serif;min-width:160px;">
            ${m.popupTitle ? `<p style="margin:0;font-weight:600;color:#0F172A;font-size:13px;">${escapeHtml(m.popupTitle)}</p>` : ''}
            ${m.popupBody ? `<p style="margin:4px 0 0;color:#475569;font-size:12px;">${escapeHtml(m.popupBody)}</p>` : ''}
          </div>`
        );
      }
      bounds.extend([m.lat, m.lng]);
    });

    // Auto-fit view kalau lebih dari 1 marker
    if (markers.length > 1) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
    } else {
      map.setView([markers[0].lat, markers[0].lng], zoom);
    }
  }, [markers, effectiveCenter, zoom]);

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0; transform: translate(-50%, -50%) scale(1.6); }
        }
        .custom-marker { background: transparent !important; border: none !important; }
        .leaflet-container { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
      `}</style>
      <div ref={containerRef} className={className} aria-label="Peta Desa" />
    </>
  );
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] ?? c));
}

const URGENCY_COLORS = {
  rendah: '#10B981',
  sedang: '#F59E0B',
  tinggi: '#F43F5E',
} as const;

const CATEGORY_COLORS: Record<string, string> = {
  'Jalan rusak': '#F59E0B',
  'Lampu jalan mati': '#F43F5E',
  'Sampah liar': '#38BDF8',
  'Drainase tersumbat': '#10B981',
  'Banjir/genangan': '#3B82F6',
  'Fasilitas umum rusak': '#8B5CF6',
  'Keamanan lingkungan': '#EC4899',
  'Pelayanan desa': '#0F766E',
  Lainnya: '#64748B',
};

/**
 * Helper: pilih warna marker berdasarkan urgency atau category.
 */
export function complaintMarkerColor(
  urgency?: string,
  category?: string
): string {
  if (urgency && urgency in URGENCY_COLORS) {
    return URGENCY_COLORS[urgency as keyof typeof URGENCY_COLORS];
  }
  if (category && category in CATEGORY_COLORS) {
    return CATEGORY_COLORS[category];
  }
  return '#0F766E';
}
