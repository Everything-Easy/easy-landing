import React from 'react';
import Container from './Container';
import { useLanguage } from '../../contexts/LanguageContext';
import easyLogoWhite from '../../assets/images/easy-logo-white.svg';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onOpenTerms }) => {
  const { t } = useLanguage();

  const quickLinks = [
    { label: t.nav.compass, href: '#compass' },
    { label: t.nav.agenda, href: '#agenda' },
    { label: t.nav.contact, href: '#contact' },
  ];

  return (
    <footer className="relative z-10 text-white pt-0 pb-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="mb-4">
              <img src={easyLogoWhite} alt="Easy" className="h-8" />
            </div>
            <p className="text-gray-400 max-w-md">
              {t.footer.description}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t.footer.quickLinks}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t.footer.privacy}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTerms}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t.footer.terms}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-500 text-sm">
          {t.footer.copyright}
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
