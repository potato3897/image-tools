'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useT } from '../../lib/LanguageContext';

export default function CompressPage() {
  const { t } = useT();
  const [preview, setPreview] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [quality, setQuality] = useState(80);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [format, setFormat] = useState<'image/jpeg' | 'image/webp' | 'image/png'>('image/jpeg');
  const [dragOver, setDragOver] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const fileInputRef = useRef<HTMLInputElement>(null!);

  const handleFile = useCallback((file: File) => {
    setOriginalSize(file.size);
    setResultUrl('');
    setCompressedSize(0);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  // Auto-compress when preview changes
  useEffect(() => {
    if (!preview) return;
    setProcessing(true);
    const timer = setTimeout(() => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const maxW = 1920;
        let w = img.naturalWidth, h = img.naturalHeight;
        if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob((blob) => {
          if (blob) {
            setResultUrl(URL.createObjectURL(blob));
            setCompressedSize(blob.size);
          }
          setProcessing(false);
        }, format, quality / 100);
      };
      img.src = preview;
    }, 300);
    return () => clearTimeout(timer);
  }, [preview, quality, format]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleFile(file);
  }, [handleFile]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragOver(true);
  };

  const download = () => { if (!resultUrl) return; const a = document.createElement('a'); const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/webp' ? 'webp' : 'png'; a.href = resultUrl; a.download = 'compressed.' + ext; a.click(); };
  const reset = () => { setPreview(''); setResultUrl(''); setOriginalSize(0); setCompressedSize(0); };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 content-fade">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1.5">{t('compress.title')}</h1>
        <p className="text-gray-500 text-sm">{t('compress.desc')}</p>
      </div>
      <canvas ref={canvasRef} className="hidden" />

      {!preview ? (
        <div className={'drop-zone ' + (dragOver ? 'border-blue-500 bg-blue-50 shadow-[0_0_0_4px_rgba(59,130,246,.15)]' : '')}
          onDragOver={handleDragOver}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}>
          <div className="drop-icon text-5xl mb-4">{dragOver ? '📥' : '📁'}</div>
          <p className="text-gray-600 text-lg font-medium mb-1">{dragOver ? t('compress.drop2') : t('compress.drop')}</p>
          <p className="text-gray-400 text-sm">{t('compress.dropHint')}</p>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="card p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <p className="text-xs text-gray-400 mb-2 font-semibold">{t('compress.original')} · {(originalSize / 1024).toFixed(1)} KB</p>
              <div className="img-container">
                <img src={preview} alt={t('compress.original.full')} className="img-preview" />
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-2 font-semibold">
                {processing ? t('compress.processing') : t('compress.compressed')}
                {!processing && resultUrl && (
                  <>
                    {' · '}{(compressedSize / 1024).toFixed(1)} KB
                    <span className="ml-2 badge badge-hot">
                      -{((1 - compressedSize / originalSize) * 100).toFixed(0)}%
                    </span>
                  </>
                )}
              </p>
              <div className="img-container">
                {resultUrl ? (
                  <img src={resultUrl} alt={t('compress.result')} className="img-preview" />
                ) : (
                  <div className="flex items-center justify-center h-full min-h-[14rem]">
                    <div className="animate-pulse text-blue-400 text-4xl">⏳</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
            <select value={format} onChange={(e) => setFormat(e.target.value as 'image/jpeg' | 'image/webp' | 'image/png')} className="select w-auto">
              <option value="image/jpeg">JPG</option>
              <option value="image/webp">WebP</option>
              <option value="image/png">PNG</option>
            </select>
            <label className="flex items-center gap-2.5 text-sm text-gray-500 min-w-[180px]">
              <span>{t('compress.quality')}</span>
              <span className="font-semibold text-gray-700 w-8 text-right">{quality}%</span>
              <input type="range" min="10" max="100" value={quality} onChange={(e) => setQuality(+e.target.value)} className="range-accent flex-1 h-2 rounded-full appearance-none bg-gray-200" />
            </label>
            {resultUrl && <button onClick={download} className="btn btn-success ml-auto">{t('compress.download')}</button>}
            <button onClick={reset} className="btn btn-ghost">{t('compress.reset')}</button>
          </div>
          <p className="text-xs text-gray-400 text-center">💡 {t('compress.autoHint')}</p>
        </div>
      )}
    </div>
  );
}
