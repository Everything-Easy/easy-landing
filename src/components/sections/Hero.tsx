import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '../layout';
import { FloatingParticles } from '../effects';
import { useLanguage } from '../../contexts/LanguageContext';

const Hero: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-white">
      <FloatingParticles count={20} />

      <Container className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="text-5xl md:text-6xl lg:text-7xl font-medium text-black leading-tight mb-6 tracking-tight"
          >
            {t.hero.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.19, 1, 0.22, 1] }}
            className="text-lg md:text-xl text-gray-text max-w-2xl mx-auto mb-12"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
          >
            <a
              href="https://compass.everythingeasy.app/register"
              className="inline-flex items-center justify-center rounded-full text-white cursor-pointer transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: 'rgb(18, 19, 23)',
                padding: '10px 24px',
                fontSize: '17.5px',
                fontWeight: 450,
                letterSpacing: '0.18px',
                lineHeight: '25.38px',
                fontVariationSettings: '"opsz" 17.5, "wdth" 100',
                border: '1px solid transparent',
              }}
            >
              Únete ya
            </a>
          </motion.div>

        </div>
      </Container>
    </section>
  );
};

export default Hero;
