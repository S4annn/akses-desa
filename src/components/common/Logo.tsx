import { Link } from 'react-router-dom';
import { brand } from '../../config/branding';

interface Props {
  to?: string;
  white?: boolean;
  showText?: boolean;
  className?: string;
}

export function Logo({ to = '/', white = false, showText = true, className = '' }: Props) {
  return (
    <Link to={to} className={`group inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative grid h-9 w-9 overflow-hidden rounded-xl bg-gradient-to-br from-brand-700 to-brand-500 shadow-soft">
        {brand.logoImage ? (
          <img
            src={brand.logoImage}
            alt={`${brand.name} Logo`}
            className="h-full w-full object-cover"
          />
        ) : (
          <>
            <span className="absolute inset-0 rounded-xl bg-white/20 opacity-0 transition group-hover:opacity-100" />
            <svg viewBox="0 0 24 24" className="m-auto h-5 w-5 text-white" fill="currentColor">
              <path d="M12 3 L21 12 L18.5 12 L18.5 21 L14 21 L14 15 L10 15 L10 21 L5.5 21 L5.5 12 L3 12 Z" />
            </svg>
          </>
        )}
      </span>
      {showText && (
        <span className="flex flex-col leading-tight">
          <span className={`text-[15px] font-extrabold tracking-tight ${white ? 'text-white' : 'text-slate-900'}`}>
            {brand.nameStart}
            <span className="text-brand-600">{brand.nameEnd}</span>
          </span>
          <span className={`text-[10px] font-medium ${white ? 'text-white/70' : 'text-slate-500'}`}>
            {brand.tagline}
          </span>
        </span>
      )}
    </Link>
  );
}
