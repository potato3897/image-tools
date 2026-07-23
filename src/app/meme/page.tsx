'use client';
import { useState, useRef } from 'react';
import { useT } from '../../lib/LanguageContext';

export default function MemePage() {
  const { t } = useT();
  const [preview, setPreview] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null!);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setResultUrl('');
    };
    reader.readAsDataURL(file);
  };

  const generate = () => {
    if (!preview) return;
    const img = new window.Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      const maxW = 600;
      let w = img.naturalWidth, h = img.naturalHeight;
      if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, w, h);

      // Draw text
      const fontSize = Math.max(16, Math.floor(w / 12));
      ctx.font = `bold ${fontSize}px "PingFang SC","Microsoft YaHei",sans-serif`;
      ctx.textAlign = 'center';
      ctx.lineWidth = fontSize / 6;
      ctx.strokeStyle = '#000';
      ctx.fillStyle = '#fff';

      if (topText) {
        ctx.strokeText(topText, w / 2, fontSize + 10);
        ctx.fillText(topText, w / 2, fontSize + 10);
      }
      if (bottomText) {
        ctx.strokeText(bottomText, w / 2, h - fontSize / 2);
        ctx.fillText(bottomText, w / 2, h - fontSize / 2);
      }

      canvas.toBlob((b) => {
        if (b) setResultUrl(URL.createObjectURL(b));
      }, 'image/png');
    };
    img.src = preview;
  };

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl; a.download = 'meme.png'; a.click();
  };

  const reset = () => { setPreview(''); setResultUrl(''); setTopText(''); setBottomText(''); };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-10 content-fade">
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-1">😄 {t('tool.meme')}</h1>
      <p className="text-gray-400 text-sm mb-6">{t('tool.meme.desc')}</p>
      <canvas ref={canvasRef} className="hidden" />

      {!preview ? (
        <div className="drop-zone">
          <div className="text-6xl drop-icon mb-4">📁</div>
          <p className="text-gray-500 text-lg font-semibold mb-1">{t('compress.drop')}</p>
          <p className="text-gray-400 text-sm">JPG/PNG</p>
          <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card p-4">
              <p className="label mb-2">{t('compress.original')}</p>
              <div className="img-container"><img src={preview} alt="" className="img-preview" /></div>
            </div>
            {resultUrl ? (
              <div className="card p-4 content-fade">
                <p className="label mb-2">{t('compress.result')}</p>
                <div className="img-container"><img src={resultUrl} alt="" className="img-preview" /></div>
              </div>
            ) : (
              <div className="card p-4 flex items-center justify-center">
                <p className="text-gray-300 text-sm">{t('meme.hint')}</p>
              </div>
            )}
          </div>

          <div className="card p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">{t('meme.topText')}</label>
                <input value={topText} onChange={e => setTopText(e.target.value)}
                  className="input" placeholder={t('meme.topPlaceholder')} />
              </div>
              <div>
                <label className="label">{t('meme.bottomText')}</label>
                <input value={bottomText} onChange={e => setBottomText(e.target.value)}
                  className="input" placeholder={t('meme.bottomPlaceholder')} />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={generate} disabled={!preview} className="btn btn-primary">{t('meme.generate')}</button>
              {resultUrl && <button onClick={download} className="btn btn-success">{t('compress.download')}</button>}
              <button onClick={reset} className="btn btn-ghost">{t('compress.reset')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
