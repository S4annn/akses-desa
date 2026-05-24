import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { village } from '../../data/dummyData';
import { useToast } from '../../hooks/useToast';

export function ContactPage() {
  const { show } = useToast();
  const [sending, setSending] = useState(false);

  return (
    <div>
      <PageHeader eyebrow="Kontak" title="Hubungi Kantor Desa" description="Sampaikan pertanyaan atau saran kepada perangkat desa." />
      <div className="container-page grid gap-6 py-10 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-1">
          {[
            { icon: MapPin, t: 'Alamat', v: village.address },
            { icon: Phone, t: 'Telepon', v: village.phone },
            { icon: Mail, t: 'Email', v: village.email },
            { icon: Clock, t: 'Jam Layanan', v: 'Senin-Jumat 08.00-15.00' },
          ].map((c) => (
            <div key={c.t} className="card flex items-start gap-3 p-4">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700">
                <c.icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs text-slate-500">{c.t}</p>
                <p className="font-semibold text-slate-800">{c.v}</p>
              </div>
            </div>
          ))}
          <div className="card overflow-hidden p-0">
            <iframe
              title="Peta Lokasi"
              src="https://www.openstreetmap.org/export/embed.html?bbox=110.355%2C-7.81%2C110.385%2C-7.78&layer=mapnik"
              className="h-56 w-full"
              loading="lazy"
            />
          </div>
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setSending(true);
            await new Promise((r) => setTimeout(r, 600));
            setSending(false);
            show('Pesan terkirim, terima kasih!', 'success');
            (e.target as HTMLFormElement).reset();
          }}
          className="card space-y-3 p-6 lg:col-span-2"
        >
          <h3 className="text-base font-semibold text-slate-900">Kirim Pesan</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="label">Nama</label><input className="input" required /></div>
            <div><label className="label">Email</label><input className="input" type="email" required /></div>
            <div className="sm:col-span-2"><label className="label">Subjek</label><input className="input" required /></div>
            <div className="sm:col-span-2"><label className="label">Pesan</label><textarea className="input" rows={5} required /></div>
          </div>
          <button disabled={sending} className="btn-primary"><Send className="h-4 w-4" /> {sending ? 'Mengirim...' : 'Kirim Pesan'}</button>
        </form>
      </div>
    </div>
  );
}
