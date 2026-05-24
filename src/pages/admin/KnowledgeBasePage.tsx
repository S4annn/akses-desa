import { BookOpen, Edit, Plus, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { knowledgeBase as initial } from '../../data/dummyData';
import { useToast } from '../../hooks/useToast';
import type { ChatbotKnowledge } from '../../types/app';

export function KnowledgeBasePage() {
  const [items, setItems] = useState<ChatbotKnowledge[]>(initial);
  const [edit, setEdit] = useState<ChatbotKnowledge | null>(null);
  const [creating, setCreating] = useState(false);
  const { show } = useToast();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900">Knowledge Base AI</h1><p className="text-sm text-slate-500">AI Desa hanya menjawab berdasarkan data ini.</p></div>
        <button onClick={() => setCreating(true)} className="btn-primary"><Plus className="h-4 w-4" /> Tambah Entri</button>
      </div>

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
              <button
                onClick={() => setItems((arr) => arr.map((x) => (x.id === k.id ? { ...x, is_active: !x.is_active } : x)))}
                className="btn-ghost"
              >
                {k.is_active ? <ToggleRight className="h-4 w-4 text-emerald-600" /> : <ToggleLeft className="h-4 w-4" />}
              </button>
              <button onClick={() => setEdit(k)} className="btn-ghost"><Edit className="h-4 w-4" /></button>
              <button onClick={() => { setItems((arr) => arr.filter((x) => x.id !== k.id)); show('Entri dihapus', 'success'); }} className="btn-ghost text-rose-600"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!edit || creating} onClose={() => { setEdit(null); setCreating(false); }} title={edit ? 'Edit Entri' : 'Tambah Entri'}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            show('Disimpan', 'success');
            setEdit(null);
            setCreating(false);
          }}
          className="space-y-3"
        >
          <div><label className="label">Pertanyaan/Topik</label><input className="input" defaultValue={edit?.question} required /></div>
          <div><label className="label">Jawaban</label><textarea className="input" rows={4} defaultValue={edit?.answer} required /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="label">Kategori</label><input className="input" defaultValue={edit?.category} required /></div>
            <div><label className="label">Status</label><select className="input" defaultValue={edit?.is_active ? 'aktif' : 'nonaktif'}><option value="aktif">Aktif</option><option value="nonaktif">Nonaktif</option></select></div>
          </div>
          <div className="flex justify-end gap-2"><button type="button" onClick={() => { setEdit(null); setCreating(false); }} className="btn-ghost">Batal</button><button className="btn-primary">Simpan</button></div>
        </form>
      </Modal>
    </div>
  );
}
