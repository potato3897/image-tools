'use client';
import Link from 'next/link';
import { useT } from '../lib/LanguageContext';

export default function Footer() {
  const { t, lang } = useT();
  return (
    <footer className="border-t border-gray-100 bg-white/70 backdrop-blur-sm mt-12">
      <div className="max-w-5xl mx-auto px-4 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs">🖤</div>
          <span className="font-bold text-gray-700 text-sm">{t('nav.brand')}</span>
        </div>
        <div className="flex justify-center gap-5 mb-4">
          {[
            { href:'/compress', key:'footer.compress' },
            { href:'/convert', key:'footer.convert' },
            { href:'/crop', key:'footer.crop' },
            { href:'/watermark', key:'footer.watermark' },
          ].map(i => (
            <Link key={i.href} href={i.href} className="text-gray-400 hover:text-blue-600 text-xs transition-colors">
              {t(i.key)}
            </Link>
          ))}
        </div>
        <p className="text-gray-400 text-xs leading-relaxed">
          {t('footer.text', { year: String(new Date().getFullYear()) })}
        </p>
      </div>
    </footer>
  );
}
