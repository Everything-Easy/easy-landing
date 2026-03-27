export type Language = 'es' | 'en';

export interface FeatureItem {
  title: string;
  description: string;
  icon: string;
}

export interface TranslationStrings {
  nav: {
    compass: string;
    agenda: string;
    contact: string;
    privacy: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    compassLabel: string;
    agendaLabel: string;
  };
  compass: {
    name: string;
    tagline: string;
    description: string;
    features: FeatureItem[];
  };
  agenda: {
    name: string;
    tagline: string;
    description: string;
    features: FeatureItem[];
    categories: string[];
    searchPlaceholder: string;
    bookingConfirmed: string;
  };
  cta: {
    title: string;
    subtitle: string;
    button: string;
  };
  footer: {
    description: string;
    quickLinks: string;
    legal: string;
    contact: string;
    privacy: string;
    terms: string;
    copyright: string;
  };
  privacyPolicy: {
    title: string;
    lastUpdated: string;
    sections: {
      title: string;
      content: string;
    }[];
  };
  terms: {
    title: string;
    lastUpdated: string;
    sections: {
      title: string;
      content: string;
    }[];
  };
}
