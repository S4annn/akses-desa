import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ChatbotKnowledge, Urgency } from '../types/app';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const isConfigured = Boolean(apiKey);

const client = isConfigured ? new GoogleGenerativeAI(apiKey as string) : null;
const MODEL = 'gemini-1.5-flash';

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

export async function askVillageAssistant(
  question: string,
  knowledgeBase: ChatbotKnowledge[]
): Promise<string> {
  const context = buildKnowledgeContext(knowledgeBase);
  if (!client) {
    // Local fallback so demo still works without API key.
    const match = knowledgeBase.find((k) =>
      k.question.toLowerCase().includes(question.toLowerCase().slice(0, 12)) ||
      question.toLowerCase().includes(k.question.toLowerCase().slice(0, 12))
    );
    if (match) return match.answer;
    return 'Maaf, informasi tersebut belum tersedia di sistem. Silakan hubungi kantor desa untuk konfirmasi lebih lanjut.';
  }

  const model = client.getGenerativeModel({
    model: MODEL,
    systemInstruction: ASSISTANT_SYSTEM,
  });

  const prompt = `Knowledge base layanan desa:\n${context}\n\nPertanyaan warga: ${question}\n\nJawab singkat dan ramah berdasarkan knowledge base saja.`;
  const result = await model.generateContent(prompt);
  return result.response.text();
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

  const model = client.getGenerativeModel({ model: MODEL });
  const prompt = `Klasifikasikan pengaduan warga berikut ke dalam JSON valid persis dengan field:
{"category":string,"urgency":"rendah"|"sedang"|"tinggi","summary":string,"recommended_action":string}.
Tanpa teks tambahan, hanya JSON.

Kategori awal: ${category}
Lokasi: ${location}
Deskripsi: ${description}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(text);
    return {
      category: parsed.category ?? fallback.category,
      urgency: (parsed.urgency as Urgency) ?? 'sedang',
      summary: parsed.summary ?? fallback.summary,
      recommended_action: parsed.recommended_action ?? fallback.recommended_action,
    };
  } catch {
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

  const model = client.getGenerativeModel({
    model: MODEL,
    systemInstruction:
      'Buat berita desa dalam bahasa Indonesia yang informatif, netral, tidak berlebihan, dan mudah dipahami warga.',
  });
  const prompt = `Berdasarkan poin singkat berikut, buat berita desa dalam JSON valid:
{"title":string,"excerpt":string,"content":string,"tags":string[]}.
Hanya JSON, tanpa teks tambahan.

Poin: ${points}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(text);
    return {
      title: parsed.title ?? fallback.title,
      excerpt: parsed.excerpt ?? fallback.excerpt,
      content: parsed.content ?? fallback.content,
      tags: Array.isArray(parsed.tags) ? parsed.tags : fallback.tags,
    };
  } catch {
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

  const model = client.getGenerativeModel({ model: MODEL });
  const prompt = `Ringkas data pengajuan layanan desa berikut untuk admin dalam JSON valid:
{"summary":string,"missing_documents":string[],"initial_note":string}.
Hanya JSON.

Data: ${JSON.stringify(data)}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(text);
    return {
      summary: parsed.summary ?? fallback.summary,
      missing_documents: Array.isArray(parsed.missing_documents) ? parsed.missing_documents : [],
      initial_note: parsed.initial_note ?? fallback.initial_note,
    };
  } catch {
    return fallback;
  }
}

export const aiAvailable = isConfigured;
