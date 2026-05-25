import { Globe } from 'lucide-react';
import { useI18n } from '../../i18n/useI18n';

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { locale, setLocale } = useI18n();
  return (
    <button
      onClick={() => setLocale(locale === 'id' ? 'en' : 'id')}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/80 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 ${className}`}
      title={locale === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
      aria-label="Toggle language"
    >
      <Globe className="h-3.5 w-3.5" />
      <span className="uppercase">{locale}</span>
    </button>
  );
}
