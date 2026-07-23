'use client';
import { useState } from 'react';

function extractUrl(raw: string): string {
  const m = raw.match(/https?:\/\/[^\s\u4e00-\u9fff]+/);
  return m ? m[0] : raw.trim();
}

export default function VideoWatermarkPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{title:string; cover:string; video:string}|null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const u = extractUrl(url);
    if (!u) return;
    setLoading(true); setResult(null); setError('');

    try {
      const resp = await fetch('/api/qyapi?appId=117354&appKey=1se2nsm2cs6dk65bxr83js8fz0bqz65m&url=' + encodeURIComponent(u));
      const data = await resp.json();
      if (data.code === 200 && data.data?.video_url) {
        setResult({ title: data.data.title || '', cover: data.data.cover_url || '', video: data.data.video_url });
        setLoading(false);
        return;
      }
      setError(data.msg || '解析失败');
    } catch {
      setError('网络错误');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-10 content-fade">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-1">🎬 视频去水印</h1>
        <p className="text-gray-400 text-sm">粘贴视频分享链接，一键解析下载无水印视频</p>
      </div>
      <div className="card p-6 space-y-5">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">🌐</span><span className="text-lg">🎵</span>
          <span className="text-lg">⚡</span><span className="text-lg">📺</span><span className="text-lg">📕</span>
        </div>
        <div>
          <label className="label">视频分享链接</label>
          <div className="flex gap-2 mt-2">
            <input value={url} onChange={e => setUrl(e.target.value)}
              placeholder="在 App 内复制分享内容，直接粘贴"
              className="input flex-1"
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            <button onClick={handleSubmit} disabled={loading}
              className="btn btn-primary whitespace-nowrap">
              {loading ? '⏳ 解析中...' : '🚀 去水印'}
            </button>
          </div>
        </div>
        {loading && (
          <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 text-center">
            <div className="animate-pulse text-3xl mb-2">⏳</div>
            <p className="text-blue-600 font-medium">正在解析视频...</p>
          </div>
        )}
        {result?.video && (
          <div className="bg-green-50 rounded-xl p-5 border border-green-200 content-fade space-y-3">
            {result.title && <p className="font-bold text-green-800 text-sm truncate">📹 {result.title}</p>}
            {result.cover && <img src={result.cover} alt="" className="rounded-lg max-h-48 object-cover" />}
            <div className="flex gap-2">
              <a href={result.video} target="_blank" rel="noreferrer" className="btn btn-success">📥 下载</a>
              <button onClick={() => { navigator.clipboard.writeText(result.video); }} className="btn btn-outline">📋 复制链接</button>
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
          <li>打开视频 App → <strong>分享 → 复制链接</strong></li>
          <li>粘贴到上方，点击"去水印"</li>
          <li>等待解析完成，点击下载</li>
        </ol>
      </div>
    </div>
  );
}