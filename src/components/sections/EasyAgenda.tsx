import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  CalendarCheck,
  CreditCard,
  Ticket,
  Clock,
  MessageCircle,
  Check,
  Star,
  MapPin,
} from 'lucide-react';
import { Container } from '../layout';
import { useLanguage } from '../../contexts/LanguageContext';
import { EasyAgendaLogo } from '../ui/EasyAgendaLogo';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Search,
  CalendarCheck,
  CreditCard,
  Ticket,
  Clock,
  MessageCircle,
};

/* ── Bitone Inner Glow (red + orange-yellow) ─────────────────────────── */
const AgendaInnerGlow: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [glowOpacity, setGlowOpacity] = useState(0);
  const [pulse, setPulse] = useState(0);

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

  useEffect(() => {
    let animFrame: number;
    const animate = () => {
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
          /* Red tone — top & left edges */
          'rgba(220, 38, 38, 0.45) 0px 0px 25px 0px inset, ' +
          'rgba(220, 38, 38, 0.20) 0px 0px 60px 0px inset, ' +
          'rgba(220, 38, 38, 0.08) 0px 0px 120px 0px inset, ' +
          /* Orange-yellow tone — bottom & right edges */
          'rgba(245, 158, 11, 0.40) 0px 0px 25px 0px inset, ' +
          'rgba(245, 158, 11, 0.18) 0px 0px 65px 0px inset, ' +
          'rgba(245, 158, 11, 0.07) 0px 0px 130px 0px inset',
      }}
    />
  );
};

const EasyAgenda: React.FC = () => {
  const { t } = useLanguage();
  const [typedText, setTypedText] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [showBusinessCard, setShowBusinessCard] = useState(false);
  const [showBookingConfirm, setShowBookingConfirm] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const searchText = t.agenda.searchPlaceholder;

  useEffect(() => {
    if (!isInView) return;

    // Typing animation
    let charIndex = 0;
    const typingTimer = setInterval(() => {
      if (charIndex < searchText.length) {
        setTypedText(searchText.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingTimer);
        setTimeout(() => setShowCategories(true), 400);
        setTimeout(() => setShowBusinessCard(true), 1200);
        setTimeout(() => setShowBookingConfirm(true), 2200);
      }
    }, 80);

    return () => clearInterval(typingTimer);
  }, [isInView, searchText]);

  return (
    <section id="agenda" className="relative py-section-mobile lg:py-section bg-white overflow-hidden min-h-screen">
      <AgendaInnerGlow />
      <Container>
        {/* Section intro */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          onViewportEnter={() => setIsInView(true)}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="text-center mb-16 lg:mb-24"
        >
          <div className="inline-block mb-6">
            <EasyAgendaLogo className="h-10 text-black" />
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-black mb-4 tracking-tight">
            {t.agenda.tagline}
          </h2>
          <p className="text-base text-gray-text max-w-2xl mx-auto">
            {t.agenda.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Feature callouts - left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="lg:col-span-4 space-y-6 order-2 lg:order-1"
          >
            {t.agenda.features.slice(0, 3).map((feature, index) => {
              const Icon = iconMap[feature.icon] || Search;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.3 }}
                  className="bg-gray-light rounded-2xl p-6 border border-gray-border"
                >
                  <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-medium text-black mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-text">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Phone mockup - center */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
            className="lg:col-span-4 order-1 lg:order-2"
          >
            <div className="mx-auto max-w-[280px] lg:max-w-[320px]">
              {/* Phone frame */}
              <div className="relative bg-black rounded-[40px] p-3 shadow-2xl">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-b-2xl z-10" />

                {/* Screen */}
                <div className="bg-white rounded-[32px] overflow-hidden min-h-[520px]">
                  {/* Status bar */}
                  <div className="h-12 bg-white flex items-end justify-center pb-1">
                    <span className="text-[10px] font-semibold text-black">9:41</span>
                  </div>

                  {/* App content */}
                  <div className="px-4 pb-6">
                    {/* Search bar */}
                    <div className="bg-gray-100 rounded-xl px-4 py-3 flex items-center gap-2 mb-4">
                      <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-400">
                        {typedText}
                        <motion.span
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="inline-block w-[1px] h-4 bg-black ml-[1px] align-middle"
                        />
                      </span>
                    </div>

                    {/* Category pills */}
                    <AnimatePresence>
                      {showCategories && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex flex-wrap gap-2 mb-5"
                        >
                          {t.agenda.categories.slice(0, 4).map((cat, i) => (
                            <motion.span
                              key={cat}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.1 }}
                              className={`text-xs px-3 py-1.5 rounded-full ${
                                i === 0 ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {cat}
                            </motion.span>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Business card */}
                    <AnimatePresence>
                      {showBusinessCard && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gray-50 rounded-2xl p-4 mb-4 border border-gray-100"
                        >
                          <div className="flex gap-3 mb-3">
                            <div className="w-14 h-14 bg-gray-200 rounded-xl flex-shrink-0" />
                            <div className="flex-1">
                              <div className="font-semibold text-sm text-black">Studio Bella</div>
                              <div className="flex items-center gap-1 text-xs text-gray-text">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                <span>4.9</span>
                                <span className="text-gray-300">·</span>
                                <MapPin className="w-3 h-3" />
                                <span>2.3km</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {['10:00', '11:30', '14:00', '16:30'].map((time) => (
                              <div
                                key={time}
                                className="flex-1 text-center text-xs py-1.5 bg-white rounded-lg border border-gray-200 text-gray-600"
                              >
                                {time}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Booking confirmation */}
                    <AnimatePresence>
                      {showBookingConfirm && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-black rounded-2xl p-4 text-white text-center"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-2"
                          >
                            <Check className="w-5 h-5 text-black" />
                          </motion.div>
                          <div className="font-semibold text-sm">{t.agenda.bookingConfirmed}</div>
                          <div className="text-xs text-white/60 mt-1">Studio Bella · 11:30</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature callouts - right */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="lg:col-span-4 space-y-6 order-3"
          >
            {t.agenda.features.slice(3, 6).map((feature, index) => {
              const Icon = iconMap[feature.icon] || Search;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.3 }}
                  className="bg-gray-light rounded-2xl p-6 border border-gray-border"
                >
                  <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-medium text-black mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-text">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

      </Container>

      {/* Category marquee — full width, outside Container */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-16 lg:mt-24 overflow-hidden w-full"
      >
        <div className="flex animate-marquee whitespace-nowrap">
          {[...t.agenda.categories, ...t.agenda.categories, ...t.agenda.categories].map((cat, i) => (
            <span
              key={i}
              className="inline-flex items-center px-6 py-3 mx-2 rounded-full border border-gray-border text-sm text-gray-text hover:bg-gray-light transition-colors"
            >
              {cat}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default EasyAgenda;
