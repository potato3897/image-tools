'use client';
import Link from 'next/link';
import { useT } from '../lib/LanguageContext';
export default function NotFound() {
  const { t } = useT();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">{t('nav.brand')} - Page Not Found</p>
      <Link href="/" className="btn-primary">Go Home</Link>
    </div>
  );
}