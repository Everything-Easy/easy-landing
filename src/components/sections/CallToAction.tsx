import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui';
import { Container } from '../layout';
import { useLanguage } from '../../contexts/LanguageContext';

const CallToAction: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="contact" className="relative pt-section-mobile lg:pt-section pb-12 lg:pb-16">
      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-6">
            {t.cta.title}
          </h2>
          <p className="text-lg md:text-xl text-gray-400 mb-10">
            {t.cta.subtitle}
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button
              size="lg"
              variant="outlined"
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
              className="!bg-white !text-black !border-white hover:!bg-gray-100"
              href="https://compass.everythingeasy.app/register"
            >
              {t.cta.button}
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};

export default CallToAction;
