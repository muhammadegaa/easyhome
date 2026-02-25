'use client';

import { LanguageProvider } from '@/lib/contexts/LanguageContext';

export default function ClientProviders({ children }) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
}
