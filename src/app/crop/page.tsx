'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useT } from '../../lib/LanguageContext';

export default function CropPage() {
  const { t } = useT();
  const [preview, setPreview] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 200, h: 200 });
  const [dragging, setDragging] = useState<string | null>(null);
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const imgRef = useRef<HTMLImageElement>(null!);
  const containerRef = useRef<HTMLDivElement>(null!);

  useEffect(() => { setMounted(true); }, []);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setPreview(url);
      setResultUrl('');
    };
    reader.readAsDataURL(file);
  }, []);

  useEffect(() => {
    if (preview) {
      const img = new window.Image();
      img.onload = () => {
        const maxW = 600;
        const scale = img.naturalWidth > maxW ? maxW / img.naturalWidth : 1;
        setImgSize({ w: Math.round(img.naturalWidth * scale), h: Math.round(img.naturalHeight * scale) });
        setCrop({ x: 20, y: 20, w: 150, h: 150 });
      };
      img.src = preview;
    }
  }, [preview]);

  const doCrop = () => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    const scaleX = img.naturalWidth / imgSize.w;
    const scaleY = img.naturalHeight / imgSize.h;
    canvas.width = crop.w * scaleX;
    canvas.height = crop.h * scaleY;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, crop.x * scaleX, crop.y * scaleY, crop.w * scaleX, crop.h * scaleY, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) setResultUrl(URL.createObjectURL(blob));
    }, 'image/png');
  };

  const download = () => { if (!resultUrl) return; const a = document.createElement('a'); a.href = resultUrl; a.download = 'cropped.png'; a.click(); };

  const handleMouse = (e: React.MouseEvent) => {
    if (!dragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    if (dragging === 'move') {
      setCrop((c) => ({ ...c, x: Math.max(0, Math.min(mx - c.w / 2, imgSize.w - c.w)), y: Math.max(0, Math.min(my - c.h / 2, imgSize.h - c.h)) }));
    } else if (dragging === 'se') {
      setCrop((c) => ({ ...c, w: Math.max(50, Math.min(mx - c.x, imgSize.w - c.x)), h: Math.max(50, Math.min(my - c.y, imgSize.h - c.y)) }));
    }
  };

  const presetCrops = [
    { label: '1:1', ratio: 1 }, { label: '4:3', ratio: 4/3 }, { label: '16:9', ratio: 16/9 }, { label: '3:2', ratio: 3/2 },
  ];

  const applyPreset = (ratio: number) => {
    const maxW = Math.min(imgSize.w - crop.x, 400);
    const w = maxW;
    const h = Math.round(w / ratio);
    setCrop((c) => ({ ...c, w: Math.min(w, imgSize.w - c.x), h: Math.min(h, imgSize.h - c.y) }));
  };

  const reset = () => { setPreview(''); setResultUrl(''); };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-10 content-fade">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">{t('crop.title')}</h1>
      <p className="text-gray-500 text-sm mb-6">{t('crop.desc')}</p>
      <canvas ref={canvasRef} className="hidden" />

      {!preview ? (
        <label className="block border-2 border-dashed border-gray-200 rounded-2xl p-10 md:p-16 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200">
          <div className="text-5xl mb-4">📁</div>
          <p className="text-gray-500 text-lg font-medium">{t('crop.drop')}</p>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
          <div className="flex gap-2 flex-wrap">
            {presetCrops.map((p) => (
              <button key={p.label} onClick={() => applyPreset(p.ratio)}
                className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-blue-50 hover:border-blue-300 transition-colors font-medium text-gray-600">
                {p.label}
              </button>
            ))}
          </div>
          {mounted && (
            <div ref={containerRef} className="relative inline-block select-none rounded-lg overflow-hidden bg-gray-200"
              onMouseMove={handleMouse} onMouseUp={() => setDragging(null)} onMouseLeave={() => setDragging(null)}>
              <img ref={imgRef} src={preview} alt="" className="block" style={{ width: imgSize.w, height: imgSize.h }} />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute border-2 border-white shadow-lg" style={{ left: crop.x, top: crop.y, width: crop.w, height: crop.h, boxShadow: '0 0 0 9999px rgba(0,0,0,0.3)' }}>
                <div className="absolute inset-0 cursor-move" onMouseDown={() => setDragging('move')} />
                <div className="absolute -right-1.5 -bottom-1.5 w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-se-resize shadow"
                  onMouseDown={(e) => { e.stopPropagation(); setDragging('se'); }} />
              </div>
            </div>
          )}
          <div className="flex gap-2 pt-2 border-t border-gray-100">
            <button onClick={doCrop} className="btn-primary">{t('crop.cropBtn')}</button>
            {resultUrl && <button onClick={download} className="btn-success">{t('crop.download')}</button>}
            <button onClick={reset} className="btn-ghost">{t('crop.reset')}</button>
          </div>
          {resultUrl && (
            <div className="content-fade">
              <p className="text-xs text-gray-400 mb-2 font-medium">{t('crop.result')}</p>
              <div className="bg-gray-100 rounded-xl flex items-center justify-center p-2" style={{ minHeight: '6rem' }}>
                <img src={resultUrl} alt={t('crop.result')} className="img-preview" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
