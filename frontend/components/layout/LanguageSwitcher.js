'use client';

import { useLanguage } from '@/lib/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { locale, changeLanguage } = useLanguage();

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-neutral-100 transition-all duration-200">
        <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        <span className="text-sm font-medium text-neutral-700">
          {locale === 'id' ? 'ID' : 'EN'}
        </span>
        <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-2xl border border-neutral-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
        <button
          onClick={() => changeLanguage('id')}
          className={`flex items-center w-full px-4 py-2.5 text-left transition-colors ${
            locale === 'id'
              ? 'bg-primary-50 text-primary-700 font-semibold'
              : 'text-neutral-700 hover:bg-primary-50 hover:text-primary-600'
          }`}
        >
          <span className="mr-3 text-lg">🇮🇩</span>
          <span>Bahasa</span>
          {locale === 'id' && (
            <svg className="w-4 h-4 ml-auto text-primary-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        <button
          onClick={() => changeLanguage('en')}
          className={`flex items-center w-full px-4 py-2.5 text-left transition-colors ${
            locale === 'en'
              ? 'bg-primary-50 text-primary-700 font-semibold'
              : 'text-neutral-700 hover:bg-primary-50 hover:text-primary-600'
          }`}
        >
          <span className="mr-3 text-lg">🇺🇸</span>
          <span>English</span>
          {locale === 'en' && (
            <svg className="w-4 h-4 ml-auto text-primary-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
