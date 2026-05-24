import type { ReactNode } from 'react';

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  action?: ReactNode;
}

export function SectionHeader({ eyebrow, title, subtitle, align = 'left', action }: Props) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between ${align === 'center' ? 'sm:items-center text-center' : ''}`}>
      <div className={align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
        <h2 className={`section-title mt-2 ${align === 'center' ? 'mx-auto' : ''}`}>{title}</h2>
        {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
