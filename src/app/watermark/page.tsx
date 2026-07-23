'use client';
import { useState, useCallback, useRef } from 'react';
import { useT } from '../../lib/LanguageContext';

export default function WatermarkPage() {
  const { t } = useT();
  const [preview, setPreview] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [text, setText] = useState('Watermark');
  const [opacity, setOpacity] = useState(30);
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState('#ffffff');
  const [position, setPosition] = useState('center');
  const [processing, setProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null!);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => { setPreview(e.target?.result as string); setResultUrl(''); };
    reader.readAsDataURL(file);
  }, []);

  const applyWatermark = () => {
    if (!preview) return;
    setProcessing(true);
    const img = new window.Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      ctx.globalAlpha = opacity / 100;
      ctx.fillStyle = color;
      ctx.font = 'bold ' + fontSize + 'px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const metrics = ctx.measureText(text);
      const tw = metrics.width, th = fontSize;
      let x = canvas.width / 2, y = canvas.height / 2;
      if (position === 'top-left') { x = tw / 2 + 20; y = th / 2 + 20; }
      else if (position === 'top-right') { x = canvas.width - tw / 2 - 20; y = th / 2 + 20; }
      else if (position === 'bottom-left') { x = tw / 2 + 20; y = canvas.height - th / 2 - 20; }
      else if (position === 'bottom-right') { x = canvas.width - tw / 2 - 20; y = canvas.height - th / 2 - 20; }
      if (position === 'tile') {
        const spacingX = tw + 60, spacingY = th + 80;
        for (let py = 0; py < canvas.height + spacingY; py += spacingY)
          for (let px = -spacingX; px < canvas.width + spacingX; px += spacingX)
            ctx.fillText(text, px + (py % (spacingY * 2) === 0 ? 0 : spacingX / 2), py);
      } else {
        ctx.fillText(text, x, y);
      }
      canvas.toBlob((blob) => {
        if (blob) setResultUrl(URL.createObjectURL(blob));
        setProcessing(false);
      }, 'image/png');
    };
    img.src = preview;
  };

  const download = () => { if (!resultUrl) return; const a = document.createElement('a'); a.href = resultUrl; a.download = 'watermarked.png'; a.click(); };
  const reset = () => { setPreview(''); setResultUrl(''); };

  const positionOptions = [
    { value: 'center', key: 'watermark.center' },
    { value: 'top-left', key: 'watermark.topLeft' },
    { value: 'top-right', key: 'watermark.topRight' },
    { value: 'bottom-left', key: 'watermark.bottomLeft' },
    { value: 'bottom-right', key: 'watermark.bottomRight' },
    { value: 'tile', key: 'watermark.tile' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-10 content-fade">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">{t('watermark.title')}</h1>
      <p className="text-gray-500 text-sm mb-6">{t('watermark.desc')}</p>
      <canvas ref={canvasRef} className="hidden" />

      {!preview ? (
        <label className="block border-2 border-dashed border-gray-200 rounded-2xl p-10 md:p-16 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200">
          <div className="text-5xl mb-4">📁</div>
          <p className="text-gray-500 text-lg font-medium">{t('watermark.drop')}</p>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-2 font-medium">{t('watermark.original')}</p>
              <div className="bg-gray-100 rounded-xl flex items-center justify-center p-2" style={{ minHeight: '12rem' }}>
                <img src={preview} alt={t('watermark.original')} className="img-preview" />
              </div>
            </div>
            {resultUrl ? (
              <div className="content-fade">
                <p className="text-xs text-gray-400 mb-2 font-medium">{t('watermark.watermarked')}</p>
                <div className="bg-gray-100 rounded-xl flex items-center justify-center p-2" style={{ minHeight: '12rem' }}>
                  <img src={resultUrl} alt={t('watermark.watermarked')} className="img-preview" />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center" style={{ minHeight: '12rem' }}>
                <p className="text-gray-300 text-sm">{t('watermark.clickHint')}</p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2 border-t border-gray-100">
            <div>
              <label className="text-xs text-gray-400 font-medium">{t('watermark.text')}</label>
              <input value={text} onChange={(e) => setText(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                placeholder={t('watermark.placeholder')} />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-medium">{t('watermark.position')}</label>
              <select value={position} onChange={(e) => setPosition(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 bg-white focus:ring-2 focus:ring-blue-100 outline-none">
                {positionOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{t(opt.key)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 font-medium">{t('watermark.fontSize')} {fontSize}px</label>
              <input type="range" min="12" max="120" value={fontSize} onChange={(e) => setFontSize(+e.target.value)}
                className="w-full mt-1 accent-blue-500" />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-medium">{t('watermark.opacity')} {opacity}%</label>
              <input type="range" min="5" max="100" value={opacity} onChange={(e) => setOpacity(+e.target.value)}
                className="w-full mt-1 accent-blue-500" />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-medium">{t('watermark.color')}</label>
              <div className="flex gap-1.5 mt-1">
                {['#ffffff', '#000000', '#ff0000', '#ffcc00'].map((c) => (
                  <button key={c} onClick={() => setColor(c)}
                    className={'w-6 h-6 rounded-full border-2 transition-all ' + (color === c ? 'border-blue-500 ring-2 ring-blue-200 scale-110' : 'border-gray-300 hover:scale-105')}
                    style={{ background: c }} />
                ))}
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-0 p-0" />
              </div>
            </div>
          </div>
          <div className="flex gap-2 pt-2 border-t border-gray-100">
            <button onClick={applyWatermark} disabled={processing} className="btn-primary">
              {processing ? t('watermark.processing') : t('watermark.apply')}
            </button>
            {resultUrl && <button onClick={download} className="btn-success">{t('watermark.download')}</button>}
            <button onClick={reset} className="btn-ghost">{t('watermark.reset')}</button>
          </div>
        </div>
      )}
    </div>
  );
}
