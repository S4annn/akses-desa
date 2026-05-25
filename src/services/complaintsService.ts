import { sampleComplaints } from '../data/dummyData';
import type { Complaint, ComplaintStatus, Urgency } from '../types/app';
import { generateTrackingCode } from '../utils/generateTrackingCode';
import { classifyComplaint } from './geminiService';
import { emit } from './notificationBus';
import { supabase } from './supabaseClient';
import { getActiveVillage } from './villageService';

const memoryComplaints: Complaint[] = [...sampleComplaints];

interface CreateComplaintInput {
  citizen_name?: string;
  phone?: string;
  is_anonymous: boolean;
  category: string;
  location: string;
  description: string;
  citizen_urgency: Urgency;
  latitude?: number;
  longitude?: number;
  photo_url?: string;
}

export async function createComplaint(input: CreateComplaintInput): Promise<{
  tracking_code: string;
  complaint: Complaint;
}> {
  const tracking_code = generateTrackingCode('ADU');

  // Run AI classifier (auto fallback if no API key)
  const ai = await classifyComplaint(input.description, input.category, input.location);

  const base: Complaint = {
    id: `mem-${Date.now()}`,
    tracking_code,
    category: input.category,
    location: input.location,
    description: input.description,
    is_anonymous: input.is_anonymous,
    citizen_urgency: input.citizen_urgency,
    ai_category: ai.category,
    ai_urgency: ai.urgency,
    ai_summary: ai.summary,
    ai_recommended_action: ai.recommended_action,
    status: 'Masuk',
    latitude: input.latitude,
    longitude: input.longitude,
    photo_url: input.photo_url,
    created_at: new Date().toISOString(),
  };

  if (!supabase) {
    memoryComplaints.unshift(base);
    emit('complaint_created', { tracking_code, category: input.category });
    return { tracking_code, complaint: base };
  }

  const village = await getActiveVillage();
  const { data, error } = await supabase
    .from('complaints')
    .insert({
      village_id: village.id,
      tracking_code,
      citizen_name: input.is_anonymous ? null : input.citizen_name ?? null,
      phone: input.is_anonymous ? null : input.phone ?? null,
      is_anonymous: input.is_anonymous,
      category: input.category,
      location: input.location,
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      description: input.description,
      photo_url: input.photo_url ?? null,
      citizen_urgency: input.citizen_urgency,
      ai_category: ai.category,
      ai_urgency: ai.urgency,
      ai_summary: ai.summary,
      ai_recommended_action: ai.recommended_action,
      status: 'Masuk',
    })
    .select()
    .single();

  if (error || !data) {
    // eslint-disable-next-line no-console
    console.warn('[Complaints] insert failed, using memory fallback:', error?.message);
    memoryComplaints.unshift(base);
    emit('complaint_created', { tracking_code, category: input.category });
    return { tracking_code, complaint: base };
  }

  emit('complaint_created', { tracking_code, category: input.category });
  return { tracking_code, complaint: { ...base, id: String(data.id) } };
}

export async function listPublicComplaints(limit = 20): Promise<Complaint[]> {
  if (!supabase) return memoryComplaints.slice(0, limit);

  // Try public-safe view first (kalau ada)
  const { data, error } = await supabase
    .from('complaints')
    .select('id, tracking_code, category, location, latitude, longitude, status, citizen_urgency, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) return memoryComplaints.slice(0, limit);
  return data.map(
    (c): Complaint => ({
      id: String(c.id),
      tracking_code: String(c.tracking_code),
      category: String(c.category ?? 'Lainnya'),
      location: String(c.location ?? '-'),
      description: '',
      is_anonymous: true,
      citizen_urgency: (c.citizen_urgency as Urgency) ?? 'sedang',
      status: (c.status as ComplaintStatus) ?? 'Masuk',
      latitude: c.latitude ?? undefined,
      longitude: c.longitude ?? undefined,
      created_at: String(c.created_at ?? new Date().toISOString()),
    })
  );
}

export async function listComplaintsForAdmin(): Promise<Complaint[]> {
  if (!supabase) return memoryComplaints;
  const { data, error } = await supabase
    .from('complaints')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return memoryComplaints;
  return data.map(
    (c): Complaint => ({
      id: String(c.id),
      tracking_code: String(c.tracking_code),
      category: String(c.category ?? 'Lainnya'),
      location: String(c.location ?? '-'),
      description: String(c.description ?? ''),
      is_anonymous: Boolean(c.is_anonymous),
      citizen_urgency: (c.citizen_urgency as Urgency) ?? 'sedang',
      ai_category: (c.ai_category as string) ?? undefined,
      ai_urgency: (c.ai_urgency as Urgency) ?? undefined,
      ai_summary: (c.ai_summary as string) ?? undefined,
      ai_recommended_action: (c.ai_recommended_action as string) ?? undefined,
      status: (c.status as ComplaintStatus) ?? 'Masuk',
      admin_response: (c.admin_response as string) ?? undefined,
      latitude: c.latitude ?? undefined,
      longitude: c.longitude ?? undefined,
      photo_url: (c.photo_url as string) ?? undefined,
      created_at: String(c.created_at ?? new Date().toISOString()),
    })
  );
}

export async function updateComplaintStatus(
  id: string,
  status: ComplaintStatus,
  adminResponse?: string
): Promise<void> {
  if (!supabase) {
    const idx = memoryComplaints.findIndex((c) => c.id === id);
    if (idx >= 0) {
      memoryComplaints[idx] = { ...memoryComplaints[idx], status, admin_response: adminResponse };
    }
    return;
  }

  const { error } = await supabase
    .from('complaints')
    .update({ status, admin_response: adminResponse ?? null, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
}
