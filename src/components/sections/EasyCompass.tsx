import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Calendar,
  Banknote,
  Megaphone,
  TrendingUp,
  Paintbrush,
  Users,
  Package,
} from 'lucide-react';
import { Container } from '../layout';
import { MorphingParticles } from '../effects';
import { useLanguage } from '../../contexts/LanguageContext';
import compassDecoration from '../../assets/images/compass-decoration.svg';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  ShoppingBag,
  Calendar,
  Banknote,
  Megaphone,
  TrendingUp,
  Paintbrush,
  Users,
  Package,
};

const InnerGlow: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [glowOpacity, setGlowOpacity] = useState(0);

  useEffect(() => {
    sectionRef.current = ref.current?.closest('section') || null;
    if (!sectionRef.current) return;

    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;

      // How far the section has entered from the bottom (0→1)
      const enterFromBottom = Math.max(0, 1 - rect.top / viewH);
      const enterProgress = Math.min(enterFromBottom / 0.4, 1);

      // How far the section is exiting from the top (1→0)
      const exitFromTop = Math.max(0, rect.bottom / viewH);
      const exitProgress = Math.min(exitFromTop / 0.4, 1);

      const isInView = rect.top < viewH && rect.bottom > 0;
      if (isInView) {
        setGlowOpacity(Math.min(enterProgress, exitProgress));
      } else {
        setGlowOpacity(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    let animFrame: number;
    const animate = () => {
      // Slow breathing: oscillates between 0.6 and 1.0 over ~4 seconds
      const t = Date.now() / 1000;
      const breath = 0.6 + 0.4 * (0.5 + 0.5 * Math.sin(t * 1.6));
      setPulse(breath);
      animFrame = requestAnimationFrame(animate);
    };
    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 2147483646,
        opacity: glowOpacity * pulse * 0.5,
        boxShadow:
          'rgba(50, 121, 249, 0.5) 0px 0px 25px 0px inset, ' +
          'rgba(50, 121, 249, 0.25) 0px 0px 60px 0px inset, ' +
          'rgba(50, 121, 249, 0.10) 0px 0px 120px 0px inset, ' +
          'rgba(50, 121, 249, 0.03) 0px 0px 200px 0px inset',
      }}
    />
  );
};

const EasyCompass: React.FC = () => {
  const { t } = useLanguage();
  const [activeFeature, setActiveFeature] = useState(0);

  const features = t.compass.features;

  return (
    <section id="compass" className="relative py-section-mobile lg:py-section bg-black text-white overflow-hidden min-h-screen">
      <InnerGlow />
      {/* Morphing particles background — covers entire section */}
      <div className="absolute inset-0 pointer-events-none">
        <MorphingParticles activeFeature={activeFeature} />
      </div>

      <Container className="relative z-10">
        {/* Section intro */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="text-center mb-16 lg:mb-24"
        >
          {/* Compass icon */}
          <motion.div
            className="inline-block mb-6"
            whileInView={{ rotate: [0, 15, -10, 0] }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3, ease: 'easeInOut' }}
          >
            <div className="w-20 h-20 mx-auto rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
              <img
                src={compassDecoration}
                alt=""
                className="w-10 h-10"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-4 tracking-tight">
            {t.compass.name}
          </h2>
          <p className="text-xl text-white/60 mb-2">{t.compass.tagline}</p>
          <p className="text-base text-white/40 max-w-2xl mx-auto">
            {t.compass.description}
          </p>
        </motion.div>

        {/* Two-column layout: feature list + detail panel */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start">
          {/* Left: Interactive feature list */}
          <div className="max-w-xl mx-auto lg:mx-0">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="space-y-2"
            >
              {features.map((feature, index) => {
                const Icon = iconMap[feature.icon] || ShoppingBag;
                const isActive = activeFeature === index;

                return (
                  <motion.button
                    key={index}
                    onClick={() => setActiveFeature(index)}
                    className={`w-full text-left px-5 py-4 rounded-xl transition-all duration-300 flex items-center gap-4 cursor-pointer ${
                      isActive
                        ? 'bg-white/10 border border-white/20'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                      isActive ? 'bg-white text-black' : 'bg-white/10 text-white/60'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className={`font-semibold transition-colors ${
                        isActive ? 'text-white' : 'text-white/60'
                      }`}>
                        {feature.title}
                      </div>
                      {/* Show description inline on mobile only */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-sm text-white/40 mt-1 lg:hidden"
                          >
                            {feature.description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="compass-active-indicator"
                        className="ml-auto w-1.5 h-8 bg-white rounded-full flex-shrink-0"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          </div>

          {/* Right: Detail panel (desktop only) */}
          <div className="hidden lg:flex lg:items-center lg:justify-center lg:min-h-[400px]">
            <AnimatePresence mode="wait">
              {(() => {
                const feature = features[activeFeature];
                const Icon = iconMap[feature.icon] || ShoppingBag;
                return (
                  <motion.div
                    key={activeFeature}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                    className="w-full max-w-md"
                  >
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                      <div className="w-14 h-14 rounded-xl bg-white text-black flex items-center justify-center mb-6">
                        <Icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-2xl font-semibold text-white mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-white/50 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default EasyCompass;
