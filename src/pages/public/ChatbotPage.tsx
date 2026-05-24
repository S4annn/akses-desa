import { motion } from 'framer-motion';
import { Bot, Loader2, Send, Sparkles, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { Seo } from '../../components/common/Seo';
import { knowledgeBase } from '../../data/dummyData';
import { askVillageAssistant } from '../../services/geminiService';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

const quick = [
  'Syarat membuat surat domisili apa?',
  'Bagaimana cara mengajukan surat usaha?',
  'Kapan jadwal posyandu?',
  'Bagaimana cara melaporkan jalan rusak?',
  'Apa saja bantuan sosial yang tersedia?',
];

export function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content:
        'Halo! Saya AI Desa, siap membantu menjawab pertanyaan tentang layanan, pengaduan, agenda, atau bantuan sosial. Silakan tanyakan apa saja.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [params] = useSearchParams();

  // Scroll HANYA dalam container chat, bukan window
  useEffect(() => {
    const el = scrollAreaRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  // Auto-fill jika ada query string (?q=...)
  useEffect(() => {
    const q = params.get('q');
    if (q) handleSend(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  async function handleSend(text?: string) {
    const q = (text ?? input).trim();
    if (!q || loading) return;
    setInput('');
    setMessages((m) => [...m, { id: Date.now(), role: 'user', content: q }]);
    setLoading(true);
    try {
      const answer = await askVillageAssistant(q, knowledgeBase);
      setMessages((m) => [...m, { id: Date.now() + 1, role: 'assistant', content: answer }]);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[Chatbot] error:', err);
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content:
            'Maaf, saya sedang tidak bisa menjawab. Silakan coba lagi atau hubungi kantor desa untuk informasi lebih lanjut.',
        },
      ]);
    } finally {
      setLoading(false);
      // Kembalikan fokus ke input agar user bisa langsung lanjut tanya
      setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 50);
    }
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    handleSend();
  }

  return (
    <div>
      <Seo title="AI Desa" description="Tanya AI Desa untuk informasi syarat layanan, jadwal kegiatan, bantuan sosial, dan panduan pengajuan dengan cepat." />
      <PageHeader
        eyebrow="AI Desa"
        title="Tanya AI Layanan Desa"
        description="Asisten cerdas yang membantu warga menemukan informasi cepat."
      />
      <div className="container-page py-10">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="card flex h-[70vh] min-h-[520px] flex-col p-0 lg:col-span-2 mb-20 lg:mb-0">
            <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-700 to-emerald-500 text-white">
                <Bot className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">AI Desa</p>
                <p className="text-[11px] text-emerald-600">● Online</p>
              </div>
            </div>

            <div ref={scrollAreaRef} className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-3 flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${
                      m.role === 'user' ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </span>
                  <div
                    className={`max-w-[78%] whitespace-pre-line rounded-2xl px-3.5 py-2 text-sm ${
                      m.role === 'user' ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 px-2 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
                  Sedang berpikir...
                </div>
              )}
            </div>

            <form onSubmit={onSubmit} className="border-t border-slate-100 p-3">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  className="input"
                  placeholder="Tulis pertanyaan Anda..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  autoComplete="off"
                />
                <button type="submit" disabled={loading || !input.trim()} className="btn-primary" aria-label="Kirim">
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-[11px] text-slate-500">
                Disclaimer: Jawaban AI Desa bersifat bantuan informasi awal. Untuk keputusan resmi, konfirmasi ke kantor desa.
              </p>
            </form>
          </div>

          <div className="space-y-4">
            <div className="card p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Sparkles className="h-4 w-4 text-brand-600" /> Pertanyaan Cepat
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {quick.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleSend(q)}
                    disabled={loading}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-left text-sm text-slate-700 transition hover:border-brand-300 hover:bg-brand-50/40 disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <p className="text-sm font-semibold text-slate-900">Kategori Pengetahuan</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {Array.from(new Set(knowledgeBase.map((k) => k.category))).map((c) => (
                  <span key={c} className="chip border border-slate-200 bg-slate-50 text-slate-700">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
