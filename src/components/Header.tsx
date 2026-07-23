'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useT } from '../lib/LanguageContext';

export default function Header(){
  const { t, lang, setLang } = useT();
  const [mounted,setMounted]=useState(false);
  const [menuOpen,setMenuOpen]=useState(false);
  useEffect(()=>{setMounted(true)},[]);

  const navItems = [
    { href:'/compress',key:'nav.compress', cat:'image' },
    { href:'/convert',key:'nav.convert', cat:'image' },
    { href:'/crop',key:'nav.crop', cat:'image' },
    { href:'/watermark',key:'nav.watermark', cat:'image' },
    { href:'/base64',key:'nav.base64', cat:'image' },
    { href:'/color',key:'nav.color', cat:'image' },
    { href:'/resize',key:'nav.resize', cat:'image' },
    { href:'/qrcode',key:'nav.qrcode', cat:'image' },
    { href:'/rotate',key:'nav.rotate', cat:'image' },
    { href:'/meme',key:'nav.meme', cat:'image', badge:'new' },
    { href:'/video-watermark',key:'nav.videoWatermark', cat:'video', badge:'new' },
    { href:'/video-text',key:'nav.videoText', cat:'video', badge:'new' },
  ];

  return (
    <header className="glass sticky top-0 z-50 border-b border-gray-100/60">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-extrabold text-lg text-gray-800 hover:text-blue-600 transition-colors shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm shadow-sm">🖤</div>
          {t('nav.brand')}
        </Link>
        {mounted&&(
          <>
            <nav className="hidden lg:flex items-center gap-0.5 mx-2 overflow-x-auto">
              {navItems.map(i=>(
                <Link key={i.href} href={i.href} prefetch={true}
                  className="relative px-2 py-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors whitespace-nowrap">
                  {t(i.key)}
                  {i.badge && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full" />}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={()=>setLang(lang==='zh'?'en':'zh')}
                className="px-2.5 py-1.5 text-xs font-bold text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200/60 hover:border-blue-200">
                {t('lang.switch')}
              </button>
              <button className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors" onClick={()=>setMenuOpen(!menuOpen)}
                aria-label={menuOpen?t('nav.close'):t('nav.menu')}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {menuOpen?<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                    :<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
      {mounted&&menuOpen&&(
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 px-4 py-3 content-fade">
          <div className="text-xs text-gray-400 font-semibold mb-2 px-3">🖼️ {t('home.imageTools')}</div>
          <div className="grid grid-cols-3 gap-1 mb-3">
            {navItems.filter(i=>i.cat==='image').map(i=>(
              <Link key={i.href} href={i.href} onClick={()=>setMenuOpen(false)} prefetch={true}
                className="px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors text-center">
                {t(i.key)}
              </Link>
            ))}
          </div>
          <div className="text-xs text-gray-400 font-semibold mb-2 px-3">🎥 {t('home.videoTools')}</div>
          <div className="grid grid-cols-3 gap-1">
            {navItems.filter(i=>i.cat==='video').map(i=>(
              <Link key={i.href} href={i.href} onClick={()=>setMenuOpen(false)} prefetch={true}
                className="px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors text-center">
                {t(i.key)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
