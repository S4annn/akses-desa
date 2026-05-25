export type ServiceStatus =
  | 'Diajukan'
  | 'Diverifikasi'
  | 'Butuh Perbaikan'
  | 'Diproses'
  | 'Siap Diambil'
  | 'Selesai'
  | 'Ditolak';

export type ComplaintStatus =
  | 'Masuk'
  | 'Ditinjau'
  | 'Dalam Tindak Lanjut'
  | 'Selesai'
  | 'Ditolak';

export type AidStatus =
  | 'Diajukan'
  | 'Diverifikasi'
  | 'Layak'
  | 'Tidak Layak'
  | 'Disalurkan'
  | 'Ditolak';

export type Urgency = 'rendah' | 'sedang' | 'tinggi';

export type PostType = 'berita' | 'pengumuman' | 'kegiatan' | 'layanan';

export interface Village {
  id: string;
  name: string;
  district: string;
  regency: string;
  province: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  history: string;
  vision: string;
  mission: string[];
  hero_image_url?: string;
  logo_url?: string;
}

export interface VillageOfficial {
  id: string;
  name: string;
  position: string;
  photo_url?: string;
}

export interface ServiceType {
  id: string;
  name: string;
  category: string;
  description: string;
  requirements: string[];
  processing_time: string;
  fee: string;
  is_active: boolean;
}

export interface ServiceRequest {
  id: string;
  tracking_code: string;
  service_type_id: string;
  service_name?: string;
  citizen_name: string;
  phone: string;
  purpose: string;
  status: ServiceStatus;
  admin_note?: string;
  created_at: string;
  updated_at?: string;
}

export interface Complaint {
  id: string;
  tracking_code: string;
  category: string;
  location: string;
  description: string;
  is_anonymous: boolean;
  citizen_name?: string;
  phone?: string;
  citizen_urgency: Urgency;
  ai_category?: string;
  ai_urgency?: Urgency;
  ai_summary?: string;
  ai_recommended_action?: string;
  status: ComplaintStatus;
  admin_response?: string;
  latitude?: number;
  longitude?: number;
  photo_url?: string;
  created_at: string;
}

export interface SocialAid {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  required_documents: string[];
  period: string;
  status: 'Aktif' | 'Tutup';
}

export interface MSME {
  id: string;
  business_name: string;
  owner_name: string;
  category: string;
  description: string;
  phone: string;
  address: string;
  image_url?: string;
  opening_hours?: string;
  is_verified: boolean;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  type: PostType;
  image_url?: string;
  author?: string;
  published_at: string;
}

export interface Agenda {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  start_date: string;
  end_date?: string;
}

export interface BudgetItem {
  id: string;
  year: number;
  category: string;
  title: string;
  allocated_amount: number;
  realized_amount: number;
  description?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  category: string;
  description?: string;
}

export interface ChatbotKnowledge {
  id: string;
  question: string;
  answer: string;
  category: string;
  is_active: boolean;
}
