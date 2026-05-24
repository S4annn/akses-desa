import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ChatbotKnowledge, Urgency } from '../types/app';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const isConfigured = Boolean(apiKey);

const client = isConfigured ? new GoogleGenerativeAI(apiKey as string) : null;

// Daftar model fallback urut: paling baru duluan, fallback ke yang lebih stabil
const MODEL_CANDIDATES = [
  'gemini-2.0-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
  'gemini-2.5-flash',
  'gemini-3.0-flash',
];

const ASSISTANT_SYSTEM = `Kamu adalah asisten layanan desa bernama AI Desa untuk aplikasi AksesDesa.
Jawab pertanyaan warga dengan bahasa Indonesia yang ramah, singkat, dan mudah dipahami.
Gunakan hanya informasi dari knowledge base yang diberikan. Jika informasi tidak tersedia,
jangan mengarang. Arahkan warga untuk menghubungi kantor desa.
Jangan memberikan keputusan final terkait bansos, hukum, atau dokumen resmi.`;

function buildKnowledgeContext(kb: ChatbotKnowledge[]): string {
  return kb
    .filter((k) => k.is_active)
    .map((k, i) => `(${i + 1}) [${k.category}] Q: ${k.question}\nA: ${k.answer}`)
    .join('\n\n');
}

/**
 * Coba beberapa model secara berurutan. Kembalikan response.text dari yang pertama berhasil.
 * Throw error terakhir kalau semua gagal.
 */
async function generateWithFallback(
  prompt: string,
  systemInstruction?: string
): Promise<string> {
  if (!client) throw new Error('Gemini client not configured');

  let lastError: unknown;
  for (const modelName of MODEL_CANDIDATES) {
    try {
      const model = client.getGenerativeModel({
        model: modelName,
        ...(systemInstruction ? { systemInstruction } : {}),
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text && text.trim().length > 0) return text;
    } catch (err) {
      lastError = err;
      // eslint-disable-next-line no-console
      console.warn(`[Gemini] Model "${modelName}" failed:`, err);
      // continue to next model
    }
  }
  throw lastError ?? new Error('Semua model AI gagal merespons.');
}

function localFallbackAnswer(question: string, kb: ChatbotKnowledge[]): string {
  const q = question.toLowerCase();
  // Cari match berdasarkan kata kunci di question / answer
  const scored = kb
    .filter((k) => k.is_active)
    .map((k) => {
      const text = `${k.question} ${k.answer}`.toLowerCase();
      const words = q.split(/\s+/).filter((w) => w.length > 3);
      const score = words.reduce((acc, w) => (text.includes(w) ? acc + 1 : acc), 0);
      return { k, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length > 0) {
    return scored[0].k.answer;
  }
  return 'Maaf, informasi tersebut belum tersedia di sistem. Silakan hubungi kantor desa untuk konfirmasi lebih lanjut.';
}

export async function askVillageAssistant(
  question: string,
  knowledgeBase: ChatbotKnowledge[]
): Promise<string> {
  if (!client) return localFallbackAnswer(question, knowledgeBase);

  const context = buildKnowledgeContext(knowledgeBase);
  const prompt = `Knowledge base layanan desa:
${context}

Pertanyaan warga: ${question}

Jawab singkat (1-3 kalimat), ramah, dan berdasarkan knowledge base di atas.
Jika tidak ada informasi yang cocok, arahkan warga untuk menghubungi kantor desa.`;

  try {
    return await generateWithFallback(prompt, ASSISTANT_SYSTEM);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[Gemini] askVillageAssistant failed, using local fallback:', err);
    return localFallbackAnswer(question, knowledgeBase);
  }
}

export interface ComplaintClassification {
  category: string;
  urgency: Urgency;
  summary: string;
  recommended_action: string;
}

export async function classifyComplaint(
  description: string,
  category: string,
  location: string
): Promise<ComplaintClassification> {
  const fallback: ComplaintClassification = {
    category: category || 'Lainnya',
    urgency: 'sedang',
    summary: description.slice(0, 160),
    recommended_action: 'Teruskan ke petugas terkait untuk pengecekan lapangan.',
  };

  if (!client) return fallback;

  const prompt = `Klasifikasikan pengaduan warga berikut ke dalam JSON valid persis dengan field:
{"category":string,"urgency":"rendah"|"sedang"|"tinggi","summary":string,"recommended_action":string}.
Tanpa teks tambahan, hanya JSON.

Kategori awal: ${category}
Lokasi: ${location}
Deskripsi: ${description}`;

  try {
    const text = (await generateWithFallback(prompt)).replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(text);
    return {
      category: parsed.category ?? fallback.category,
      urgency: (parsed.urgency as Urgency) ?? 'sedang',
      summary: parsed.summary ?? fallback.summary,
      recommended_action: parsed.recommended_action ?? fallback.recommended_action,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[Gemini] classifyComplaint failed:', err);
    return fallback;
  }
}

export interface GeneratedNews {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
}

export async function generateVillageNews(points: string): Promise<GeneratedNews> {
  const fallback: GeneratedNews = {
    title: 'Kegiatan Desa Terbaru',
    excerpt: points.slice(0, 160),
    content: points,
    tags: ['desa', 'kegiatan'],
  };
  if (!client) return fallback;

  const prompt = `Berdasarkan poin singkat berikut, buat berita desa dalam JSON valid:
{"title":string,"excerpt":string,"content":string,"tags":string[]}.
Hanya JSON, tanpa teks tambahan.

Poin: ${points}`;

  try {
    const text = (await generateWithFallback(
      prompt,
      'Buat berita desa dalam bahasa Indonesia yang informatif, netral, tidak berlebihan, dan mudah dipahami warga.'
    ))
      .replace(/```json|```/g, '')
      .trim();
    const parsed = JSON.parse(text);
    return {
      title: parsed.title ?? fallback.title,
      excerpt: parsed.excerpt ?? fallback.excerpt,
      content: parsed.content ?? fallback.content,
      tags: Array.isArray(parsed.tags) ? parsed.tags : fallback.tags,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[Gemini] generateVillageNews failed:', err);
    return fallback;
  }
}

export interface RequestSummary {
  summary: string;
  missing_documents: string[];
  initial_note: string;
}

export async function summarizeServiceRequest(data: Record<string, unknown>): Promise<RequestSummary> {
  const fallback: RequestSummary = {
    summary: 'Pengajuan layanan diterima, menunggu verifikasi admin.',
    missing_documents: [],
    initial_note: 'Periksa kelengkapan dokumen pendukung.',
  };
  if (!client) return fallback;

  const prompt = `Ringkas data pengajuan layanan desa berikut untuk admin dalam JSON valid:
{"summary":string,"missing_documents":string[],"initial_note":string}.
Hanya JSON.

Data: ${JSON.stringify(data)}`;

  try {
    const text = (await generateWithFallback(prompt)).replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(text);
    return {
      summary: parsed.summary ?? fallback.summary,
      missing_documents: Array.isArray(parsed.missing_documents) ? parsed.missing_documents : [],
      initial_note: parsed.initial_note ?? fallback.initial_note,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[Gemini] summarizeServiceRequest failed:', err);
    return fallback;
  }
}

export const aiAvailable = isConfigured;
