import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe } from 'lucide-react';
import { Button } from '../ui';
import Container from './Container';
import { useLanguage } from '../../contexts/LanguageContext';
import easyLogo from '../../assets/images/easy-logo.svg';

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#compass', label: t.nav.compass },
    { href: '#agenda', label: t.nav.agenda },
    { href: '#contact', label: t.nav.contact },
  ];

  return (
    <header
      className="absolute top-0 left-0 right-0 z-50 bg-transparent"
    >
      <Container>
        <nav className="flex items-center justify-between h-20">
          <a href="/" className="flex items-center">
            <img src={easyLogo} alt="Easy" className="h-8" />
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-text hover:text-black transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              className="flex items-center gap-2 text-gray-text hover:text-black transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <Globe className="w-5 h-5" />
              <span className="uppercase text-sm font-medium">{language}</span>
            </button>

            <Button variant="primary" size="sm" href="https://compass.everythingeasy.app/register">
              {t.hero.cta}
            </Button>
          </div>

          <button
            className="lg:hidden p-2 text-black"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </Container>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t"
          >
            <Container className="py-6">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-gray-text hover:text-black transition-colors font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <hr className="my-2" />
                <button
                  onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
                  className="flex items-center gap-2 text-gray-text py-2"
                >
                  <Globe className="w-5 h-5" />
                  <span>{language === 'es' ? 'English' : 'Español'}</span>
                </button>
                <Button fullWidth className="mt-2" href="https://compass.everythingeasy.app/register">
                  {t.hero.cta}
                </Button>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
