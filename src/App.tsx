import { Header, Footer } from './components/layout';
import { Hero, EasyCompass, EasyAgenda, CallToAction } from './components/sections';
import { FloatingParticles } from './components/effects';

function App() {
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

export default App;
