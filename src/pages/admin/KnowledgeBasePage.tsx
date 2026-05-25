import { BookOpen, Edit, Plus, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../hooks/useToast';
import {
  createKnowledge,
  deleteKnowledge,
  listAllKnowledge,
  updateKnowledge,
} from '../../services/knowledgeBaseService';
import { subscribeRefresh } from '../../services/notificationBus';
import type { ChatbotKnowledge } from '../../types/app';

export function KnowledgeBasePage() {
  const [items, setItems] = useState<ChatbotKnowledge[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<ChatbotKnowledge | null>(null);
  const [creating, setCreating] = useState(false);
  const { show } = useToast();

  async function refresh() {
    setLoading(true);
    try {
      setItems(await listAllKnowledge());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    const unsub = subscribeRefresh(['kb_changed'], refresh);
    return unsub;
  }, []);

  async function toggle(id: string, current: boolean) {
    try {
      await updateKnowledge(id, { is_active: !current });
      setItems((arr) => arr.map((x) => (x.id === id ? { ...x, is_active: !current } : x)));
    } catch (err) {
      show((err as Error).message || 'Gagal update', 'error');
    }
  }

  async function remove(id: string) {
    if (!confirm('Hapus entri ini?')) return;
    try {
      await deleteKnowledge(id);
      setItems((arr) => arr.filter((x) => x.id !== id));
      show('Entri dihapus', 'success');
    } catch (err) {
      show((err as Error).message || 'Gagal hapus', 'error');
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Knowledge Base AI</h1>
          <p className="text-sm text-slate-500">AI Desa hanya menjawab berdasarkan data ini.</p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-primary"><Plus className="h-4 w-4" /> Tambah Entri</button>
      </div>

      {loading && <div className="card p-8 text-center text-sm text-slate-500">Memuat data...</div>}
      {!loading && items.length === 0 && (
        <EmptyState
          title="Knowledge base masih kosong"
          description="Tambahkan FAQ, syarat layanan, jam operasional, dan informasi lain agar AI bisa menjawab pertanyaan warga."
          icon={<BookOpen className="h-7 w-7" />}
          action={<button onClick={() => setCreating(true)} className="btn-primary"><Plus className="h-4 w-4" /> Tambah Entri Pertama</button>}
        />
      )}

      {!loading && items.length > 0 && (
        <div className="grid gap-3">
          {items.map((k) => (
            <div key={k.id} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-start">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700"><BookOpen className="h-5 w-5" /></span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="chip border border-slate-200 bg-slate-50 text-slate-700">{k.category}</span>
                  <span className={`chip border ${k.is_active ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>{k.is_active ? 'Aktif' : 'Nonaktif'}</span>
                </div>
                <p className="mt-2 font-semibold text-slate-900">{k.question}</p>
                <p className="mt-1 text-sm text-slate-600">{k.answer}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => toggle(k.id, k.is_active)} className="btn-ghost">
                  {k.is_active ? <ToggleRight className="h-4 w-4 text-emerald-600" /> : <ToggleLeft className="h-4 w-4" />}
                </button>
                <button onClick={() => setEdit(k)} className="btn-ghost"><Edit className="h-4 w-4" /></button>
                <button onClick={() => remove(k.id)} className="btn-ghost text-rose-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!edit || creating} onClose={() => { setEdit(null); setCreating(false); }} title={edit ? 'Edit Entri' : 'Tambah Entri'}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const payload = {
              question: String(fd.get('question') ?? ''),
              answer: String(fd.get('answer') ?? ''),
              category: String(fd.get('category') ?? 'Umum'),
              is_active: String(fd.get('is_active') ?? 'true') === 'true',
            };
            try {
              if (edit) {
                await updateKnowledge(edit.id, payload);
              } else {
                await createKnowledge(payload);
              }
              show('Disimpan', 'success');
              setEdit(null);
              setCreating(false);
              refresh();
            } catch (err) {
              show((err as Error).message || 'Gagal simpan', 'error');
            }
          }}
          className="space-y-3"
        >
          <div><label className="label">Pertanyaan/Topik</label><input name="question" className="input" defaultValue={edit?.question} required /></div>
          <div><label className="label">Jawaban</label><textarea name="answer" className="input" rows={4} defaultValue={edit?.answer} required /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="label">Kategori</label><input name="category" className="input" defaultValue={edit?.category ?? 'Layanan'} required /></div>
            <div>
              <label className="label">Status</label>
              <select name="is_active" className="input" defaultValue={edit ? String(edit.is_active) : 'true'}>
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2"><button type="button" onClick={() => { setEdit(null); setCreating(false); }} className="btn-ghost">Batal</button><button className="btn-primary">Simpan</button></div>
        </form>
      </Modal>
    </div>
  );
}
