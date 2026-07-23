'use client';
import { useState } from 'react';

function extractUrl(raw: string): string {
  const m = raw.match(/https?:\/\/[^\s\u4e00-\u9fff]+/);
  return m ? m[0] : raw.trim();
}

export default function VideoTextPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const extractText = async () => {
    const u = extractUrl(url);
    if (!u) return;
    setLoading(true); setText(''); setError('');

    try {
      const resp = await fetch('/api/parse-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: u }),
      });
      const data = await resp.json();

      if (data.title) {
        setText(data.title);
        setLoading(false);
        return;
      }
      setError(data.error || '未提取到内容，请确认链接有效');
    } catch {
      setError('网络请求失败，请检查网络后重试');
    }
    setLoading(false);
  };

  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-10 content-fade">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-1">📝 视频文案提取</h1>
        <p className="text-gray-400 text-sm">粘贴视频链接，自动提取标题和描述文案</p>
      </div>

      <div className="card p-6 space-y-5">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">🌐</span><span className="text-lg">🎵</span><span className="text-lg">⚡</span><span className="text-lg">📺</span><span className="text-lg">📕</span>
        </div>

        <div>
          <label className="label">视频分享链接</label>
          <div className="flex gap-2 mt-2">
            <input value={url} onChange={e => setUrl(e.target.value)}
              placeholder="在 App 内复制分享内容，直接粘贴（自动提取链接）"
              className="input flex-1"
              onKeyDown={e => e.key === 'Enter' && extractText()} />
            <button onClick={extractText} disabled={loading}
              className="btn btn-primary whitespace-nowrap">
              {loading ? '⏳ 提取中...' : '🔍 提取文案'}
            </button>
          </div>
        </div>

        {loading && (
          <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 text-center">
            <div className="animate-pulse text-3xl mb-2">⏳</div>
            <p className="text-emerald-600 font-medium">正在解析视频信息...</p>
          </div>
        )}

        {text && (
          <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200 content-fade space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-700">📝 提取结果</span>
              <button onClick={copy} className="btn btn-sm btn-outline">{copied ? '✅ 已复制' : '📋 复制'}</button>
            </div>
            <div className="bg-white rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto border border-emerald-100">
              {text}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-amber-50 rounded-xl p-5 border border-amber-200 content-fade">
            <div className="flex items-start gap-3"><span className="text-2xl">⚠️</span><p className="text-sm text-amber-700">{error}</p></div>
          </div>
        )}
      </div>

      <div className="mt-8 card p-5">
        <h3 className="font-bold text-gray-700 mb-3">📖 操作步骤</h3>
        <ol className="space-y-2 text-sm text-gray-500 list-decimal list-inside">
          <li>打开 App → <strong>分享 → 复制链接</strong></li>
          <li>粘贴到上方，点击"提取文案"</li>
          <li>结果可直接复制使用</li>
        </ol>
      </div>
    </div>
  );
}
