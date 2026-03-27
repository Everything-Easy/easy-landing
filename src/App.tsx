import { Routes, Route } from 'react-router-dom';
import { Header, Footer } from './components/layout';
import { Hero, EasyCompass, EasyAgenda, CallToAction } from './components/sections';
import { FloatingParticles } from './components/effects';
import LegalPage from './pages/LegalPage';
import { useLanguage } from './contexts/LanguageContext';

function Landing() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <EasyCompass />
        <EasyAgenda />
        <div className="relative bg-black overflow-hidden">
          <FloatingParticles
            count={15}
            colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.15)']}
          />
          <CallToAction />
          <Footer />
        </div>
      </main>
    </div>
  );
}

function PrivacyPage() {
  const { t } = useLanguage();
  return (
    <LegalPage
      title={t.privacyPolicy.title}
      lastUpdated={t.privacyPolicy.lastUpdated}
      sections={t.privacyPolicy.sections}
    />
  );
}

function TermsPage() {
  const { t } = useLanguage();
  return (
    <LegalPage
      title={t.terms.title}
      lastUpdated={t.terms.lastUpdated}
      sections={t.terms.sections}
    />
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
    </Routes>
  );
}

export default App;
