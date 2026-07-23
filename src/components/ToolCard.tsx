'use client';
import Link from 'next/link';
import React from 'react';

interface ToolCardProps {
  icon: string;
  titleKey: string;
  descKey: string;
  href: string;
  color: string;
  badgeKey?: string;
  t: (key: string, params?: Record<string, string>) => string;
}

export default function ToolCard({ icon, titleKey, descKey, href, color, badgeKey, t }: ToolCardProps) {
  return (
    <Link href={href} className="tool-card">
      <div className="flex items-start gap-4">
        <div className={'tool-icon bg-gradient-to-br ' + color + ' text-white shadow-sm shrink-0'}>{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <h3 className="text-base font-bold text-gray-800 group-hover:text-blue-600 truncate">{t(titleKey)}</h3>
            {badgeKey && (
              <span className={'badge ' + (badgeKey==='home.hot'?'badge-hot':'badge-new')}>{t(badgeKey)}</span>
            )}
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">{t(descKey)}</p>
        </div>
        <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors mt-1.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
