import { useState } from 'react';
import { Header, Footer } from './components/layout';
import { Hero, EasyCompass, EasyAgenda, CallToAction } from './components/sections';
import { FloatingParticles } from './components/effects';
import LegalModal from './components/ui/PrivacyPolicyModal';
import { useLanguage } from './contexts/LanguageContext';

function App() {
  const { t } = useLanguage();
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

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
          <Footer
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
            onOpenTerms={() => setIsTermsOpen(true)}
          />
        </div>
      </main>
      <LegalModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        title={t.privacyPolicy.title}
        lastUpdated={t.privacyPolicy.lastUpdated}
        sections={t.privacyPolicy.sections}
      />
      <LegalModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        title={t.terms.title}
        lastUpdated={t.terms.lastUpdated}
        sections={t.terms.sections}
      />
    </div>
  );
}

export default App;
