import type { ReactNode } from 'react';

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  pattern?: boolean;
}

export function PageHeader({ eyebrow, title, description, action, pattern = true }: Props) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200/60 bg-gradient-to-br from-brand-700 via-brand-600 to-emerald-500 text-white">
      {pattern && (
        <>
          <div className="absolute inset-0 opacity-30 bg-topo-pattern" />
          <div className="blob h-72 w-72 -top-20 -left-20 bg-emerald-400/40" />
          <div className="blob h-80 w-80 -bottom-32 -right-10 bg-teal-300/30" />
        </>
      )}
      <div className="container-page relative py-12 sm:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            {eyebrow && <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest">{eyebrow}</span>}
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
            {description && <p className="mt-2 max-w-2xl text-white/85">{description}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      </div>
    </section>
  );
}
