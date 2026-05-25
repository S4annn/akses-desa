import { ArrowLeft, Eye, EyeOff, FileText, MessageSquareWarning, ShieldCheck, Sparkles, Store } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../../components/common/Logo';
import { images } from '../../config/images';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { listComplaintsForAdmin } from '../../services/complaintsService';
import { listAllMSMEs } from '../../services/msmeService';
import { listRequestsForAdmin } from '../../services/serviceRequestsService';

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn, loading } = useAuth();
  const { show } = useToast();
  const [email, setEmail] = useState('admin@aksesdesa.id');
  const [password, setPassword] = useState('aksesdesa123');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ requests: number; complaints: number; msmes: number } | null>(null);

  // Fetch stats real dari Supabase saat mount
  useEffect(() => {
    Promise.all([
      listRequestsForAdmin().catch(() => []),
      listComplaintsForAdmin().catch(() => []),
      listAllMSMEs().catch(() => []),
    ]).then(([r, c, m]) => {
      setStats({
        requests: r.length,
        complaints: c.length,
        msmes: m.length,
      });
    });
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await signIn(email, password);
      show('Berhasil masuk', 'success');
      navigate('/admin');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      {/* Left panel — visual */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-emerald-700 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url("${images.loginBackground}")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/80 via-brand-800/70 to-emerald-800/80" />
        <div className="absolute inset-0 bg-topo-pattern opacity-30" />
        <div className="blob h-80 w-80 -top-20 -left-10 bg-brand-400/40" />
        <div className="blob h-72 w-72 -bottom-20 -right-10 bg-emerald-400/40" />
        <div className="relative">
          <Logo white />
          <div className="mt-16 max-w-md">
            <span className="chip border border-white/20 bg-white/10">
              <Sparkles className="h-3.5 w-3.5" /> Civic-Tech Village Portal
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-tight">
              Kelola layanan desa dengan dashboard yang ramah dan modern.
            </h1>
            <p className="mt-3 text-white/85">
              Pantau pengajuan, pengaduan, UMKM, dan transparansi desa dari satu tempat.
            </p>
          </div>
        </div>
        <div className="relative grid grid-cols-3 gap-3">
          <StatTile icon={FileText} label="Pengajuan" value={stats?.requests} />
          <StatTile icon={MessageSquareWarning} label="Pengaduan" value={stats?.complaints} />
          <StatTile icon={Store} label="UMKM" value={stats?.msmes} />
        </div>
      </div>

      {/* Right panel — form */}
      <div className="grid place-items-center bg-mist p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Tombol Back ke landing */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-brand-300 hover:bg-brand-50/40 hover:text-brand-700"
              aria-label="Kembali ke beranda"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke Beranda</span>
            </Link>
            <div className="lg:hidden">
              <Logo />
            </div>
          </div>

          <span className="chip border border-brand-100 bg-brand-50 text-brand-700">
            <ShieldCheck className="h-3.5 w-3.5" /> Login Admin
          </span>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">Masuk ke Dashboard</h2>
          <p className="mt-1 text-slate-500">Khusus perangkat desa & admin AksesDesa.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label className="label" htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="login-password">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPwd ? 'text' : 'password'}
                  className="input pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                  aria-label={showPwd ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </div>
            )}
            <button disabled={loading} className="btn-primary w-full justify-center">
              {loading ? 'Memuat...' : 'Masuk'}
            </button>
            <p className="text-center text-xs text-slate-500">
              Akun demo: <b>admin@aksesdesa.id</b> · password: <b>aksesdesa123</b>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileText;
  label: string;
  value: number | undefined;
}) {
  const isLoading = value === undefined;
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur">
      <Icon className="mx-auto mb-1 h-4 w-4 text-white/70" />
      <p className="text-2xl font-bold tabular-nums">
        {isLoading ? <span className="inline-block h-6 w-8 animate-pulse rounded bg-white/30" /> : value}
      </p>
      <p className="text-xs opacity-80">{label}</p>
    </div>
  );
}
