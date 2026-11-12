import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import FooterSection from './components/FooterSection';
import HomePage from './pages/HomePage';
import DiscoverPage from './pages/DiscoverPage';
import MenuPage from './pages/MenuPage';
import AboutPage from './pages/AboutPage';
import CampaignPage from './pages/CampaignPage';
import ContactPage from './pages/ContactPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <CartProvider>
        <ScrollToTop />
        <Navbar />
        <CartDrawer />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/collaboration" element={<CampaignPage />} />
          <Route path="/campaign" element={<CampaignPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <FooterSection />
      </CartProvider>
    </MotionConfig>
  );
}
