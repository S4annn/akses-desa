import { Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../components/common/Logo';
import { images } from '../../config/images';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn, loading } = useAuth();
  const { show } = useToast();
  const [email, setEmail] = useState('admin@aksesdesa.id');
  const [password, setPassword] = useState('aksesdesa123');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-emerald-700 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        {/* Background image */}
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
            <span className="chip border border-white/20 bg-white/10"><Sparkles className="h-3.5 w-3.5" /> Civic-Tech Village Portal</span>
            <h1 className="mt-4 text-4xl font-bold leading-tight">
              Kelola layanan desa dengan dashboard yang ramah dan modern.
            </h1>
            <p className="mt-3 text-white/85">
              Pantau pengajuan, pengaduan, UMKM, dan transparansi desa dari satu tempat.
            </p>
          </div>
        </div>
        <div className="relative grid grid-cols-3 gap-3">
          {['Pengajuan','Pengaduan','UMKM'].map((t) => (
            <div key={t} className="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur">
              <p className="text-2xl font-bold">+{Math.floor(Math.random() * 80 + 20)}</p>
              <p className="text-xs opacity-80">{t}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid place-items-center bg-mist p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-6 lg:hidden"><Logo /></div>
          <span className="chip border border-brand-100 bg-brand-50 text-brand-700"><ShieldCheck className="h-3.5 w-3.5" /> Login Admin</span>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">Masuk ke Dashboard</h2>
          <p className="mt-1 text-slate-500">Khusus perangkat desa & admin AksesDesa.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} className="input pr-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100">
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <button disabled={loading} className="btn-primary w-full justify-center">{loading ? 'Memuat...' : 'Masuk'}</button>
            <p className="text-center text-xs text-slate-500">
              Akun demo: <b>admin@aksesdesa.id</b> · password: <b>aksesdesa123</b>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
