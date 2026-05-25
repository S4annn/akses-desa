/**
 * Cross-tab notification bus untuk sinkronisasi real-time.
 * Pattern: emit event saat data berubah → semua tab yang subscribe auto-refresh.
 *
 * Pakai Supabase Realtime kalau env terisi untuk update lintas-device.
 */

export type EventType =
  | 'request_created'
  | 'request_updated'
  | 'request_deleted'
  | 'complaint_created'
  | 'complaint_updated'
  | 'complaint_deleted'
  | 'msme_created'
  | 'msme_updated'
  | 'msme_deleted'
  | 'post_created'
  | 'post_updated'
  | 'post_deleted'
  | 'agenda_created'
  | 'agenda_updated'
  | 'agenda_deleted'
  | 'gallery_created'
  | 'gallery_deleted'
  | 'aid_created'
  | 'aid_updated'
  | 'aid_deleted'
  | 'budget_changed'
  | 'kb_changed'
  | 'village_updated';

export interface BusEvent {
  type: EventType;
  payload: Record<string, unknown>;
  ts: number;
}

const KEY = 'aksesdesa.bus';

export function emit(type: EventType, payload: Record<string, unknown> = {}) {
  const event: BusEvent = { type, payload, ts: Date.now() };
  try {
    localStorage.setItem(KEY, JSON.stringify(event));
    window.dispatchEvent(new CustomEvent('aksesdesa:bus', { detail: event }));
  } catch {
    // ignore quota
  }
}

export function subscribe(handler: (event: BusEvent) => void): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY && e.newValue) {
      try {
        handler(JSON.parse(e.newValue) as BusEvent);
      } catch {
        // ignore
      }
    }
  };
  const onCustom = (e: Event) => {
    handler((e as CustomEvent<BusEvent>).detail);
  };
  window.addEventListener('storage', onStorage);
  window.addEventListener('aksesdesa:bus', onCustom);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener('aksesdesa:bus', onCustom);
  };
}

/**
 * Subscribe untuk subset events tertentu.
 * Kalau salah satu match, panggil refresh().
 */
export function subscribeRefresh(eventTypes: EventType[], refresh: () => void): () => void {
  return subscribe((event) => {
    if (eventTypes.includes(event.type)) {
      refresh();
    }
  });
}
