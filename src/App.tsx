import { useState } from 'react';
import { Header, Footer } from './components/layout';
import { Hero, EasyCompass, EasyAgenda, CallToAction } from './components/sections';
import { FloatingParticles } from './components/effects';
import PrivacyPolicyModal from './components/ui/PrivacyPolicyModal';

function App() {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

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
          <Footer onOpenPrivacy={() => setIsPrivacyOpen(true)} />
        </div>
      </main>
      <PrivacyPolicyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </div>
  );
}

export default App;
