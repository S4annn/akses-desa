/**
 * Simple cross-tab notification bus untuk demo mode.
 * Real Supabase mode bisa di-extend pakai Supabase Realtime.
 *
 * Pakai: dispatch saat entity dibuat → broadcast via storage event ke semua tab admin.
 */

type EventType = 'request_created' | 'complaint_created' | 'msme_created';

interface BusEvent {
  type: EventType;
  payload: Record<string, unknown>;
  ts: number;
}

const KEY = 'aksesdesa.bus';

export function emit(type: EventType, payload: Record<string, unknown> = {}) {
  const event: BusEvent = { type, payload, ts: Date.now() };
  try {
    localStorage.setItem(KEY, JSON.stringify(event));
    // Trigger same-tab listeners juga
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
