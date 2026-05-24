import { useEffect } from 'react';
import type { UseFormReturn, FieldValues } from 'react-hook-form';

const PREFIX = 'aksesdesa.form.';

/**
 * Auto-save form values ke localStorage dengan debounce.
 * Restore otomatis saat komponen mount.
 *
 * @example
 * const form = useForm({ ... });
 * useFormAutosave('service-request', form);
 */
export function useFormAutosave<T extends FieldValues>(
  key: string,
  form: UseFormReturn<T>,
  options?: { debounceMs?: number; exclude?: (keyof T)[] }
) {
  const fullKey = PREFIX + key;
  const debounceMs = options?.debounceMs ?? 600;
  const exclude = (options?.exclude ?? []) as string[];

  // Restore saat mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(fullKey);
      if (!raw) return;
      const saved = JSON.parse(raw);
      Object.keys(saved).forEach((k) => {
        if (!exclude.includes(k) && saved[k] !== undefined && saved[k] !== '') {
          form.setValue(k as never, saved[k] as never, { shouldValidate: false, shouldDirty: false });
        }
      });
    } catch {
      // ignore corrupted storage
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullKey]);

  // Auto-save dengan debounce
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const sub = form.watch((values) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        try {
          const filtered: Record<string, unknown> = {};
          Object.entries(values as Record<string, unknown>).forEach(([k, v]) => {
            if (!exclude.includes(k)) filtered[k] = v;
          });
          localStorage.setItem(fullKey, JSON.stringify(filtered));
        } catch {
          // quota exceeded etc.
        }
      }, debounceMs);
    });
    return () => {
      sub.unsubscribe();
      if (timer) clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullKey]);

  return {
    clear: () => {
      try {
        localStorage.removeItem(fullKey);
      } catch {
        // ignore
      }
    },
    hasSaved: () => {
      try {
        return Boolean(localStorage.getItem(fullKey));
      } catch {
        return false;
      }
    },
  };
}
