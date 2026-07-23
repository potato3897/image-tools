'use client';
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { LanguageProvider } from '../lib/LanguageContext';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <Header />
      <main className="min-h-[calc(100vh-8rem)]">{children}</main>
      <Footer />
    </LanguageProvider>
  );
}
