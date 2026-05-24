import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

export function EmptyState({
  title = 'Belum ada data',
  description = 'Data akan muncul di sini setelah ditambahkan.',
  icon,
  action,
}: {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-brand-600">
        {icon ?? <Inbox className="h-7 w-7" />}
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
