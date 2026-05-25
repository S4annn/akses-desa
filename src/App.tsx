import { ScrollToTop } from './components/common/ScrollToTop';
import { InstallPrompt } from './components/common/InstallPrompt';
import { UpdateBanner } from './components/common/UpdateBanner';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <UpdateBanner />
      <AppRoutes />
      <InstallPrompt />
    </>
  );
}
