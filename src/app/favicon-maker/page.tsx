'use client';
import { useState, useRef } from 'react';
import { useT } from '../../lib/LanguageContext';

const sizes = [16, 32, 64, 128, 256];

export default function FaviconPage() {
  const { t } = useT();
  const [preview, setPreview] = useState('');
  const [results, setResults] = useState<Record<number,string>>({});
  const canvasRef = useRef<HTMLCanvasElement>(null!);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setPreview(url);
      setResults({});
      generateAll(url);
    };
    reader.readAsDataURL(file);
  };

  const generateAll = (url: string) => {
    const img = new window.Image();
    img.onload = () => {
      const newResults: Record<number,string> = {};
      sizes.forEach(s => {
        const canvas = canvasRef.current;
        canvas.width = s; canvas.height = s;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, s, s);
        newResults[s] = canvas.toDataURL('image/png');
      });
      setResults(newResults);
    };
    img.src = url;
  };

  const download = (size: number) => {
    const a = document.createElement('a');
    a.href = results[size];
    a.download = `favicon-${size}x${size}.png`;
    a.click();
  };

  const reset = () => { setPreview(''); setResults({}); };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-10 content-fade">
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-1">⭐ {t('tool.favicon')}</h1>
      <p className="text-gray-400 text-sm mb-6">{t('tool.favicon.desc')}</p>
      <canvas ref={canvasRef} className="hidden" />

      {!preview ? (
        <div className="drop-zone">
          <div className="text-6xl drop-icon mb-4">📁</div>
          <p className="text-gray-500 text-lg font-semibold mb-1">{t('compress.drop')}</p>
          <p className="text-gray-400 text-sm">{t('favicon.dropHint')}</p>
          <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="card p-4">
            <p className="label mb-2">{t('compress.original')}</p>
            <div className="flex justify-center">
              <img src={preview} alt="" className="w-48 h-48 object-contain rounded-xl" />
            </div>
          </div>

          <div className="card p-5">
            <p className="label mb-3">{t('favicon.results')}</p>
            <div className="grid grid-cols-5 gap-4">
              {sizes.map(s => (
                <div key={s} className="text-center">
                  <div className="bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-2 border border-gray-200"
                    style={{ width: s > 64 ? 96 : s + 32, height: s > 64 ? 96 : s + 32 }}>
                    {results[s] ? (
                      <img src={results[s]} alt={`${s}x${s}`} className="rounded" style={{ width: s, height: s }} />
                    ) : (
                      <div className="animate-pulse text-gray-300 text-xs">⏳</div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 font-mono mb-1">{s}×{s}</p>
                  {results[s] && (
                    <button onClick={() => download(s)} className="btn btn-sm btn-outline text-[10px] py-1">
                      📥
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <button onClick={reset} className="btn btn-ghost">{t('compress.reset')}</button>
        </div>
      )}
    </div>
  );
}
