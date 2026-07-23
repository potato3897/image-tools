'use client';
import { useState, useRef, useEffect } from 'react';
import { useT } from '../../lib/LanguageContext';

type Layout = 'horizontal' | 'vertical' | 'grid2' | 'grid4';

export default function CollagePage() {
  const { t } = useT();
  const [images, setImages] = useState<string[]>([]);
  const [resultUrl, setResultUrl] = useState('');
  const [layout, setLayout] = useState<Layout>('grid2');
  const canvasRef = useRef<HTMLCanvasElement>(null!);

  const handleFiles = (files: FileList) => {
    const readers = Array.from(files).map(file => new Promise<string>(resolve => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    }));
    Promise.all(readers).then(urls => {
      setImages(urls.slice(0, 4));
      setResultUrl('');
    });
  };

  useEffect(() => {
    if (images.length < 2) return;
    const imgEls = images.map(src => {
      return new Promise<HTMLImageElement>(resolve => {
        const img = new window.Image();
        img.onload = () => resolve(img);
        img.src = src;
      });
    });

    Promise.all(imgEls).then(imgs => {
      const canvas = canvasRef.current;
      const size = 800;
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, size, size);

      if (layout === 'horizontal') {
        const w = size / imgs.length;
        imgs.forEach((img, i) => {
          ctx.drawImage(img, i * w, 0, w, size);
        });
      } else if (layout === 'vertical') {
        const h = size / imgs.length;
        imgs.forEach((img, i) => {
          ctx.drawImage(img, 0, i * h, size, h);
        });
      } else if (layout === 'grid2') {
        const half = size / 2;
        if (imgs.length >= 2) {
          ctx.drawImage(imgs[0], 0, 0, half, half);
          ctx.drawImage(imgs[1], half, 0, half, half);
        }
        if (imgs.length >= 3) ctx.drawImage(imgs[2], 0, half, half, half);
        if (imgs.length >= 4) ctx.drawImage(imgs[3], half, half, half, half);
      } else if (layout === 'grid4') {
        const q = size / 2;
        for (let i = 0; i < Math.min(imgs.length, 4); i++) {
          const x = (i % 2) * q;
          const y = Math.floor(i / 2) * q;
          ctx.drawImage(imgs[i], x, y, q, q);
        }
      }
      canvas.toBlob(b => { if (b) setResultUrl(URL.createObjectURL(b)); }, 'image/png');
    });
  }, [images, layout]);

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl; a.download = 'collage.png'; a.click();
  };

  const reset = () => { setImages([]); setResultUrl(''); };

  const layouts: {key:Layout; label:string; icon:string}[] = [
    { key:'horizontal', label:t('collage.horizontal'), icon:'⬌' },
    { key:'vertical', label:t('collage.vertical'), icon:'⬍' },
    { key:'grid2', label:t('collage.grid2'), icon:'⊞' },
    { key:'grid4', label:t('collage.grid4'), icon:'⊟' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-10 content-fade">
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-1">📄 {t('tool.collage')}</h1>
      <p className="text-gray-400 text-sm mb-6">{t('tool.collage.desc')}</p>
      <canvas ref={canvasRef} className="hidden" />

      {images.length === 0 ? (
        <div className="drop-zone">
          <div className="text-6xl drop-icon mb-4">📁</div>
          <p className="text-gray-500 text-lg font-semibold mb-1">{t('collage.drop')}</p>
          <p className="text-gray-400 text-sm">{t('collage.dropHint')}</p>
          <input type="file" accept="image/*" multiple className="hidden" onChange={e => e.target.files && handleFiles(e.target.files)} />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Layout selector */}
          <div className="flex flex-wrap gap-2">
            {layouts.map(l => (
              <button key={l.key} onClick={() => setLayout(l.key)}
                className={'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all ' +
                  (layout === l.key
                    ? 'bg-pink-50 border-pink-300 text-pink-700 shadow-sm'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300')}>
                {l.icon} {l.label}
              </button>
            ))}
          </div>

          {/* Preview */}
          <div className="grid grid-cols-2 gap-3">
            {images.map((img, i) => (
              <div key={i} className="card p-2 relative">
                <img src={img} alt="" className="w-full h-32 object-cover rounded-lg" />
                <button onClick={() => setImages(images.filter((_,j) => j !== i))}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600">
                  ✕
                </button>
              </div>
            ))}
            {images.length < 4 && (
              <label className="card p-2 flex items-center justify-center cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors h-32 border-2 border-dashed border-gray-200">
                <span className="text-3xl text-gray-300">+</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={e => e.target.files && handleFiles(e.target.files)} />
              </label>
            )}
          </div>

          {/* Result */}
          {resultUrl && (
            <div className="card p-4 content-fade">
              <p className="label mb-2">{t('compress.result')}</p>
              <div className="flex justify-center">
                <img src={resultUrl} alt="collage" className="max-h-96 rounded-xl shadow-sm" />
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {resultUrl && <button onClick={download} className="btn btn-success">{t('compress.download')}</button>}
            <button onClick={reset} className="btn btn-ghost">{t('compress.reset')}</button>
          </div>
        </div>
      )}
    </div>
  );
}
