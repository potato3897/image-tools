'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useT } from '../../lib/LanguageContext';

const formats = [
  { value: 'image/png', label: 'PNG' },
  { value: 'image/jpeg', label: 'JPG' },
  { value: 'image/webp', label: 'WebP' },
  { value: 'image/bmp', label: 'BMP' },
];

export default function ConvertPage() {
  const { t } = useT();
  const [preview, setPreview] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [targetFormat, setTargetFormat] = useState('image/png' as string);
  const [processing, setProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const fileInputRef = useRef<HTMLInputElement>(null!);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setResultUrl('');
  }, []);

  useEffect(() => {
    if (!preview) return;
    setProcessing(true);
    const timer = setTimeout(() => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d')!;
        if (targetFormat === 'image/jpeg' || targetFormat === 'image/webp') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) setResultUrl(URL.createObjectURL(blob));
          setProcessing(false);
        }, targetFormat, 0.92);
      };
      img.src = preview;
    }, 300);
    return () => clearTimeout(timer);
  }, [preview, targetFormat]);

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

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    const ext = targetFormat.split('/')[1].replace('jpeg', 'jpg');
    a.href = resultUrl;
    a.download = 'converted.' + ext;
    a.click();
  };

  const reset = () => { setPreview(''); setResultUrl(''); };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-10 content-fade">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">{t('convert.title')}</h1>
      <p className="text-gray-500 text-sm mb-6">{t('convert.desc')}</p>
      <canvas ref={canvasRef} className="hidden" />

      {!preview ? (
        <div className={'drop-zone ' + (dragOver ? 'border-blue-500 bg-blue-50 shadow-[0_0_0_4px_rgba(59,130,246,.15)]' : '')}
          onDragOver={handleDragOver}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}>
          <div className="text-5xl drop-icon mb-4">{dragOver ? '📥' : '📁'}</div>
          <p className="text-gray-500 text-lg font-medium">{dragOver ? t('compress.drop2') : t('convert.drop')}</p>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="card p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-2 font-medium">{t('convert.original')}</p>
              <div className="img-container">
                <img src={preview} alt={t('convert.original')} className="img-preview" />
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-2 font-medium">
                {processing ? t('convert.processing') : t('convert.converted') + ' · ' + targetFormat.split('/')[1].toUpperCase()}
              </p>
              <div className="img-container">
                {resultUrl ? (
                  <img src={resultUrl} alt={t('convert.converted')} className="img-preview" />
                ) : (
                  <div className="flex items-center justify-center" style={{ minHeight: '12rem' }}>
                    <div className="animate-pulse text-green-400 text-4xl">⏳</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100">
            <span className="text-sm text-gray-500">{t('convert.to')}</span>
            {formats.map((f) => (
              <button key={f.value} onClick={() => setTargetFormat(f.value)}
                className={'px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-150 ' +
                  (targetFormat === f.value
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50')
                }>
                {f.label}
              </button>
            ))}
            {resultUrl && <button onClick={download} className="btn-success ml-auto">{t('convert.download')}</button>}
            <button onClick={reset} className="btn-ghost">{t('convert.reset')}</button>
          </div>
          <p className="text-xs text-gray-400 text-center">💡 {t('convert.autoHint')}</p>
        </div>
      )}
    </div>
  );
}
