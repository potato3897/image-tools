'use client';
import { useState, useCallback } from 'react';
import { useT } from '../../lib/LanguageContext';

export default function Base64Page() {
  const { t } = useT();
  const [preview, setPreview] = useState('');
  const [base64, setBase64] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result as string);
      setBase64(result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const copy = () => { navigator.clipboard.writeText(base64); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const reset = () => { setPreview(''); setBase64(''); };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-10 content-fade">
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-1">{t('tool.base64')}</h1>
      <p className="text-gray-400 text-sm mb-6">{t('tool.base64.desc')}</p>

      {!preview ? (
        <label className="drop-zone">
          <div className="text-6xl drop-icon mb-4">📁</div>
          <p className="text-gray-500 text-lg font-semibold mb-1">{t('compress.drop')}</p>
          <p className="text-gray-400 text-sm">{t('compress.dropHint')}</p>
          <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      ) : (
        <div className="space-y-4">
          <div className="img-container"><img src={preview} alt="" className="img-preview" /></div>
          <div className="card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="label">Base64</span>
              <span className="badge bg-gray-100 text-gray-500">{(base64.length / 1024).toFixed(1)} KB</span>
            </div>
            <textarea readOnly value={base64} className="w-full h-32 text-xs font-mono bg-gray-50 rounded-xl p-3 border border-gray-100 resize-none outline-none"
              onClick={e => (e.target as HTMLTextAreaElement).select()} />
            <div className="flex gap-2">
              <button onClick={copy} className="btn-primary">{copied ? t('qrcode.copied') : t('qrcode.copy')}</button>
              <button onClick={reset} className="btn-outline">{t('compress.reset')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
