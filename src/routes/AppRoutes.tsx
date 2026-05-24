import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { LoadingScreen } from '../components/common/LoadingScreen';
import { PublicLayout } from '../layouts/PublicLayout';
import { HomePage } from '../pages/public/HomePage';
import { ProtectedRoute } from './ProtectedRoute';

// Public pages
const ProfilePage = lazy(() => import('../pages/public/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const ServicesPage = lazy(() => import('../pages/public/ServicesPage').then((m) => ({ default: m.ServicesPage })));
const ServiceRequestPage = lazy(() => import('../pages/public/ServiceRequestPage').then((m) => ({ default: m.ServiceRequestPage })));
const TrackingPage = lazy(() => import('../pages/public/TrackingPage').then((m) => ({ default: m.TrackingPage })));
const SocialAidPage = lazy(() => import('../pages/public/SocialAidPage').then((m) => ({ default: m.SocialAidPage })));
const ComplaintPage = lazy(() => import('../pages/public/ComplaintPage').then((m) => ({ default: m.ComplaintPage })));
const MSMEPage = lazy(() => import('../pages/public/MSMEPage').then((m) => ({ default: m.MSMEPage })));
const NewsPage = lazy(() => import('../pages/public/NewsPage').then((m) => ({ default: m.NewsPage })));
const NewsDetailPage = lazy(() => import('../pages/public/NewsDetailPage').then((m) => ({ default: m.NewsDetailPage })));
const AgendaPage = lazy(() => import('../pages/public/AgendaPage').then((m) => ({ default: m.AgendaPage })));
const TransparencyPage = lazy(() => import('../pages/public/TransparencyPage').then((m) => ({ default: m.TransparencyPage })));
const GalleryPage = lazy(() => import('../pages/public/GalleryPage').then((m) => ({ default: m.GalleryPage })));
const ContactPage = lazy(() => import('../pages/public/ContactPage').then((m) => ({ default: m.ContactPage })));
const ChatbotPage = lazy(() => import('../pages/public/ChatbotPage').then((m) => ({ default: m.ChatbotPage })));
const LoginPage = lazy(() => import('../pages/public/LoginPage').then((m) => ({ default: m.LoginPage })));
const NotFoundPage = lazy(() => import('../pages/public/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

// Admin pages
const AdminLayout = lazy(() => import('../layouts/AdminLayout').then((m) => ({ default: m.AdminLayout })));
const DashboardPage = lazy(() => import('../pages/admin/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const ServiceRequestsAdminPage = lazy(() => import('../pages/admin/ServiceRequestsPage').then((m) => ({ default: m.ServiceRequestsAdminPage })));
const ComplaintsAdminPage = lazy(() => import('../pages/admin/ComplaintsPage').then((m) => ({ default: m.ComplaintsAdminPage })));
const SocialAidAdminPage = lazy(() => import('../pages/admin/SocialAidAdminPage').then((m) => ({ default: m.SocialAidAdminPage })));
const MSMEAdminPage = lazy(() => import('../pages/admin/MSMEAdminPage').then((m) => ({ default: m.MSMEAdminPage })));
const PostsAdminPage = lazy(() => import('../pages/admin/PostsAdminPage').then((m) => ({ default: m.PostsAdminPage })));
const AgendaAdminPage = lazy(() => import('../pages/admin/AgendaAdminPage').then((m) => ({ default: m.AgendaAdminPage })));
const TransparencyAdminPage = lazy(() => import('../pages/admin/TransparencyAdminPage').then((m) => ({ default: m.TransparencyAdminPage })));
const GalleryAdminPage = lazy(() => import('../pages/admin/GalleryAdminPage').then((m) => ({ default: m.GalleryAdminPage })));
const KnowledgeBasePage = lazy(() => import('../pages/admin/KnowledgeBasePage').then((m) => ({ default: m.KnowledgeBasePage })));
const VillageSettingsPage = lazy(() => import('../pages/admin/VillageSettingsPage').then((m) => ({ default: m.VillageSettingsPage })));

function PageFallback() {
  return <LoadingScreen fullScreen={false} message="Sedang memuat halaman..." />;
}

export function AppRoutes() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/profil" element={<ProfilePage />} />
            <Route path="/layanan" element={<ServicesPage />} />
            <Route path="/ajukan" element={<ServiceRequestPage />} />
            <Route path="/cek-status" element={<TrackingPage />} />
            <Route path="/bansos" element={<SocialAidPage />} />
            <Route path="/pengaduan" element={<ComplaintPage />} />
            <Route path="/umkm" element={<MSMEPage />} />
            <Route path="/berita" element={<NewsPage />} />
            <Route path="/berita/:slug" element={<NewsDetailPage />} />
            <Route path="/agenda" element={<AgendaPage />} />
            <Route path="/transparansi" element={<TransparencyPage />} />
            <Route path="/galeri" element={<GalleryPage />} />
            <Route path="/kontak" element={<ContactPage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<DashboardPage />} />
              <Route path="/admin/pengajuan" element={<ServiceRequestsAdminPage />} />
              <Route path="/admin/pengaduan" element={<ComplaintsAdminPage />} />
              <Route path="/admin/bansos" element={<SocialAidAdminPage />} />
              <Route path="/admin/umkm" element={<MSMEAdminPage />} />
              <Route path="/admin/berita" element={<PostsAdminPage />} />
              <Route path="/admin/agenda" element={<AgendaAdminPage />} />
              <Route path="/admin/transparansi" element={<TransparencyAdminPage />} />
              <Route path="/admin/galeri" element={<GalleryAdminPage />} />
              <Route path="/admin/knowledge" element={<KnowledgeBasePage />} />
              <Route path="/admin/pengaturan" element={<VillageSettingsPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
