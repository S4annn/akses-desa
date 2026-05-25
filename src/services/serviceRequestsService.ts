import { isSupabaseConfigured, supabase } from './supabaseClient';
import { emit } from './notificationBus';
import { getActiveVillage } from './villageService';
import { sampleRequests, serviceTypes as dummyServiceTypes } from '../data/dummyData';
import type { ServiceRequest, ServiceStatus, ServiceType } from '../types/app';
import { generateTrackingCode } from '../utils/generateTrackingCode';

// In-memory store untuk demo mode (persist across navigation dalam satu session)
const memoryRequests: ServiceRequest[] = [...sampleRequests];

interface CreateRequestInput {
  service_type_id: string;
  citizen_name: string;
  nik: string;
  kk_number: string;
  birth_place: string;
  birth_date: string;
  gender: string;
  address: string;
  hamlet: string;
  rt: string;
  rw: string;
  phone: string;
  email?: string;
  purpose: string;
  notes?: string;
}

export async function listServiceTypes(): Promise<ServiceType[]> {
  if (!supabase) return dummyServiceTypes;
  const { data, error } = await supabase
    .from('service_types')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });
  if (error || !data) return dummyServiceTypes;
  return data.map(normalizeServiceType);
}

export async function createServiceRequest(input: CreateRequestInput): Promise<{ tracking_code: string }> {
  const tracking_code = generateTrackingCode('ADS');

  if (!supabase) {
    const svc = dummyServiceTypes.find((s) => s.id === input.service_type_id);
    memoryRequests.unshift({
      id: `mem-${Date.now()}`,
      tracking_code,
      service_type_id: input.service_type_id,
      service_name: svc?.name ?? 'Layanan',
      citizen_name: input.citizen_name,
      phone: input.phone,
      purpose: input.purpose,
      status: 'Diajukan',
      created_at: new Date().toISOString(),
    });
    emit('request_created', { tracking_code, service_name: svc?.name ?? 'Layanan' });
    return { tracking_code };
  }

  const village = await getActiveVillage();
  const { error } = await supabase.from('service_requests').insert({
    village_id: village.id,
    service_type_id: input.service_type_id,
    tracking_code,
    citizen_name: input.citizen_name,
    nik: input.nik,
    kk_number: input.kk_number,
    birth_place: input.birth_place,
    birth_date: input.birth_date,
    gender: input.gender,
    address: input.address,
    hamlet: input.hamlet,
    rt: input.rt,
    rw: input.rw,
    phone: input.phone,
    email: input.email || null,
    purpose: input.purpose,
    notes: input.notes ?? null,
    status: 'Diajukan',
  });

  if (error) {
    console.error('[Requests] INSERT FAILED to Supabase:', error);
    console.error('[Requests] >>> Pastikan RLS policy "requests insert public" sudah di-apply.');
    throw new Error(
      `Pengajuan tidak dapat tersimpan: ${error.message}. Hubungi admin desa.`
    );
  }
  emit('request_created', { tracking_code, service_name: dummyServiceTypes.find((s) => s.id === input.service_type_id)?.name ?? 'Layanan' });
  return { tracking_code };
}

export async function findRequestByTrackingCode(code: string): Promise<ServiceRequest | null> {
  const normalized = code.trim().toUpperCase();

  if (!supabase) {
    return memoryRequests.find((r) => r.tracking_code === normalized) ?? null;
  }

  const { data, error } = await supabase
    .from('service_requests')
    .select('*, service_types(name, category)')
    .eq('tracking_code', normalized)
    .maybeSingle();

  if (error || !data) return null;
  return normalizeRequest(data);
}

export async function listRequestsForAdmin(): Promise<ServiceRequest[]> {
  if (!supabase) return memoryRequests;

  const { data, error } = await supabase
    .from('service_requests')
    .select('*, service_types(name, category)')
    .order('created_at', { ascending: false });

  if (error || !data) return memoryRequests;
  return data.map(normalizeRequest);
}

export async function updateRequestStatus(
  id: string,
  status: ServiceStatus,
  adminNote?: string
): Promise<void> {
  if (!supabase) {
    const idx = memoryRequests.findIndex((r) => r.id === id);
    if (idx >= 0) {
      memoryRequests[idx] = { ...memoryRequests[idx], status, admin_note: adminNote };
    }
    emit('request_updated', { id });
    return;
  }

  const { error } = await supabase
    .from('service_requests')
    .update({ status, admin_note: adminNote ?? null, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
  emit('request_updated', { id });
}

export async function deleteRequest(id: string): Promise<void> {
  if (!supabase) {
    const idx = memoryRequests.findIndex((r) => r.id === id);
    if (idx >= 0) memoryRequests.splice(idx, 1);
    emit('request_deleted', { id });
    return;
  }
  const { error } = await supabase.from('service_requests').delete().eq('id', id);
  if (error) throw new Error(error.message);
  emit('request_deleted', { id });
}

export const isUsingRealSupabase = isSupabaseConfigured;

function normalizeRequest(row: Record<string, unknown>): ServiceRequest {
  const svc = (row.service_types ?? {}) as { name?: string };
  return {
    id: String(row.id ?? ''),
    tracking_code: String(row.tracking_code ?? ''),
    service_type_id: String(row.service_type_id ?? ''),
    service_name: svc.name ?? (row.service_name as string) ?? 'Layanan',
    citizen_name: String(row.citizen_name ?? ''),
    phone: String(row.phone ?? ''),
    purpose: String(row.purpose ?? ''),
    status: (row.status as ServiceStatus) ?? 'Diajukan',
    admin_note: (row.admin_note as string) ?? undefined,
    created_at: String(row.created_at ?? new Date().toISOString()),
    updated_at: (row.updated_at as string) ?? undefined,
  };
}

function normalizeServiceType(row: Record<string, unknown>): ServiceType {
  const requirements = row.requirements;
  let parsed: string[] = [];
  if (Array.isArray(requirements)) parsed = requirements as string[];
  else if (typeof requirements === 'string') {
    try {
      parsed = JSON.parse(requirements) as string[];
    } catch {
      parsed = [];
    }
  }
  return {
    id: String(row.id ?? ''),
    name: String(row.name ?? ''),
    category: String(row.category ?? 'Lainnya'),
    description: String(row.description ?? ''),
    requirements: parsed,
    processing_time: String(row.processing_time ?? '1-2 hari kerja'),
    fee: String(row.fee ?? 'Gratis'),
    is_active: Boolean(row.is_active ?? true),
  };
}
