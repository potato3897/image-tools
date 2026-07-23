'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { useT } from '../lib/LanguageContext';
import ToolCard from '../components/ToolCard';
import AdBanner from '../components/AdBanner';

export default function HomePage() {
  const { t } = useT();
  const toolsRef = useRef<HTMLElement>(null!);
  
  const scrollToTools = () => {
    toolsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const imageTools = [
    { icon:'🗜️',titleKey:'tool.compress',descKey:'tool.compress.desc',href:'/compress',color:'from-blue-500 to-blue-600',badgeKey:'home.hot'},
    { icon:'🔄',titleKey:'tool.convert',descKey:'tool.convert.desc',href:'/convert',color:'from-green-500 to-emerald-600'},
    { icon:'✂️',titleKey:'tool.crop',descKey:'tool.crop.desc',href:'/crop',color:'from-yellow-500 to-orange-500'},
    { icon:'💧',titleKey:'tool.watermark',descKey:'tool.watermark.desc',href:'/watermark',color:'from-purple-500 to-pink-500'},
    { icon:'🔢',titleKey:'tool.base64',descKey:'tool.base64.desc',href:'/base64',color:'from-gray-500 to-gray-700'},
    { icon:'🎨',titleKey:'tool.color',descKey:'tool.color.desc',href:'/color',color:'from-red-500 to-pink-600'},
    { icon:'📐',titleKey:'tool.resize',descKey:'tool.resize.desc',href:'/resize',color:'from-indigo-500 to-blue-600'},
    { icon:'📱',titleKey:'tool.qrcode',descKey:'tool.qrcode.desc',href:'/qrcode',color:'from-teal-500 to-cyan-600',badgeKey:'home.new'},
    { icon:'↻',titleKey:'tool.rotate',descKey:'tool.rotate.desc',href:'/rotate',color:'from-rose-500 to-red-600'},
    { icon:'😄',titleKey:'tool.meme',descKey:'tool.meme.desc',href:'/meme',color:'from-amber-400 to-orange-500',badgeKey:'home.new'},
    { icon:'⭐',titleKey:'tool.favicon',descKey:'tool.favicon.desc',href:'/favicon-maker',color:'from-cyan-500 to-blue-500',badgeKey:'home.new'},
    { icon:'📄',titleKey:'tool.collage',descKey:'tool.collage.desc',href:'/collage',color:'from-pink-400 to-rose-500',badgeKey:'home.new'},
  ];

  const videoTools = [
    { icon:'🎬',titleKey:'tool.videoWatermark',descKey:'tool.videoWatermark.desc',href:'/video-watermark',color:'from-violet-500 to-purple-700',badgeKey:'home.new'},
    { icon:'📝',titleKey:'tool.videoText',descKey:'tool.videoText.desc',href:'/video-text',color:'from-emerald-400 to-teal-600',badgeKey:'home.new'},
  ];

  const trustItems = [
    { icon:'🔒', key:'1' },
    { icon:'⚡', key:'2' },
    { icon:'🚀', key:'3' },
  ];
  
  return (
    <div className="content-fade">
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-20 text-center px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-purple-50/30 to-transparent pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-blue-100 text-blue-700 rounded-full mb-5">{t('home.badge')}</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
            {t('home.title')}
          </h1>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed">
            {t('home.subtitle')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button onClick={scrollToTools} className="btn btn-primary btn-lg shadow-lg shadow-blue-500/20">
              {t('home.cta')}
            </button>
            <Link href="/qrcode" className="btn btn-outline btn-lg">
              {t('home.qrcode')}
            </Link>
          </div>
        </div>
      </section>

      <AdBanner />

      {/* Image Tools */}
      <section ref={toolsRef} className="max-w-6xl mx-auto px-4 pb-12 scroll-mt-20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 rounded-full mb-3">
            <span className="text-lg">🖼️</span>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">{t('home.imageTools')}</span>
          </div>
          <h2 className="section-title">{t('home.imageToolsTitle')}</h2>
          <p className="section-sub">{t('home.imageToolsSub')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {imageTools.map((tool, idx) => <ToolCard key={idx} {...tool} t={t} />)}
        </div>
      </section>

      {/* Video Tools */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-50 rounded-full mb-3">
            <span className="text-lg">🎥</span>
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">{t('home.videoTools')}</span>
          </div>
          <h2 className="section-title">{t('home.videoToolsTitle')}</h2>
          <p className="section-sub">{t('home.videoToolsSub')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {videoTools.map((tool, idx) => <ToolCard key={idx} {...tool} t={t} />)}
        </div>
      </section>

      {/* Trust */}
      <section className="bg-white/80 border-y border-gray-100 py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="section-title">{t('home.why')}</h2>
          <p className="section-sub">{t('home.whySub')}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {trustItems.map(item => (
              <div key={item.key} className="text-center px-2 py-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-2xl mx-auto mb-4 shadow-sm">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-1.5">{t('home.trust.'+item.key+'.title')}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{t('home.trust.'+item.key+'.desc')}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center px-4">
        <div className="max-w-xl mx-auto">
          <h2 className="section-title">{t('home.ready')}</h2>
          <p className="text-gray-500 mb-8">{t('home.readySub')}</p>
          <button onClick={scrollToTools} className="btn btn-primary btn-lg shadow-lg shadow-blue-500/20">
            {t('home.readyCta')}
          </button>
        </div>
      </section>
    </div>
  );
}
