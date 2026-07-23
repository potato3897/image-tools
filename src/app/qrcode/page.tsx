'use client';
import { useState, useRef, useCallback } from 'react';
import { useT } from '../../lib/LanguageContext';

export default function QRCodePage(){
  const { t } = useT();
  const [text,setText]=useState('');
  const [qrUrl,setQrUrl]=useState('');
  const [size,setSize]=useState(256);
  const [fg,setFg]=useState('#000000');
  const [bg,setBg]=useState('#ffffff');
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);
  const [copied,setCopied]=useState(false);
  const canvasRef=useRef<HTMLCanvasElement>(null!);

  const generate=useCallback(async ()=>{
    if(!text.trim()){setError(t('qrcode.error'));return}
    setError('');setLoading(true);
    try{
      const QRCode=(await import('qrcode')).default;
      const c=canvasRef.current;
      await QRCode.toCanvas(c,text,{width:size,margin:2,color:{dark:fg,light:bg}});
      setQrUrl(c.toDataURL('image/png'));
    }catch(e){setError(t('qrcode.fail'))}
    setLoading(false);
  },[text,size,fg,bg,t]);

  const download=()=>{if(!qrUrl)return;const a=document.createElement('a');a.href=qrUrl;a.download='qrcode.png';a.click()};

  const copyImg=async()=>{
    if(!qrUrl)return;
    const blob=await fetch(qrUrl).then(r=>r.blob());
    await navigator.clipboard.write([new ClipboardItem({'image/png':blob})]);
    setCopied(true);setTimeout(()=>setCopied(false),2000);
  };

  const presets=[
    {key:'qrcode.preset.url',value:'https://',placeholder:'https://example.com'},
    {key:'qrcode.preset.email',value:'mailto:',placeholder:'mailto:hello@example.com'},
    {key:'qrcode.preset.tel',value:'tel:',placeholder:'tel:+8613800138000'},
    {key:'qrcode.preset.text',value:'',placeholder:'Enter text...'},
    {key:'qrcode.preset.wifi',value:'WIFI:S:',placeholder:'WIFI:S:MyWiFi;T:WPA;P:password;;'},
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-10 content-fade">
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-1">{t('qrcode.title')}</h1>
      <p className="text-gray-400 text-sm mb-6">{t('qrcode.desc')}</p>
      <canvas ref={canvasRef} className="hidden"/>

      <div className="grid md:grid-cols-5 gap-4">
        <div className="card p-5 space-y-4 md:col-span-3">
          <div><label className="label">{t('qrcode.type')}</label>
            <div className="flex flex-wrap gap-1.5">{presets.map(p=>(
              <button key={p.key} onClick={()=>setText(p.value)}
                className={'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all '+
                  (text===p.value?'bg-blue-50 border-blue-300 text-blue-600':'border-gray-200 text-gray-500 hover:border-gray-300')}>
                {t(p.key)}
              </button>
            ))}</div>
          </div>
          <div><label className="label">{t('qrcode.content')}</label>
            <textarea value={text} onChange={e=>setText(e.target.value)} placeholder={presets.find(p=>text===p.value)?.placeholder||t('qrcode.error')}
              className="input h-24 resize-none font-mono text-sm" /></div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="label">{t('qrcode.size')}</label>
              <select value={size} onChange={e=>setSize(+e.target.value)} className="select">
                <option value={128}>128px</option><option value={256}>256px</option><option value={512}>512px</option><option value={1024}>1024px</option>
              </select></div>
            <div><label className="label">{t('qrcode.fg')}</label><input type="color" value={fg} onChange={e=>setFg(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer border border-gray-200"/></div>
            <div><label className="label">{t('qrcode.bg')}</label><input type="color" value={bg} onChange={e=>setBg(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer border border-gray-200"/></div>
          </div>
          {error&&<p className="text-red-400 text-xs">{error}</p>}
          <button onClick={generate} disabled={loading} className="btn-primary w-full">{loading?t('qrcode.processing'):t('qrcode.generate')}</button>
        </div>

        <div className="card p-5 flex flex-col items-center justify-center gap-4 md:col-span-2">
          {qrUrl?(
            <div className="content-fade flex flex-col items-center gap-4">
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100"><img src={qrUrl} alt="QR Code" className="w-48 h-48 rounded-xl"/></div>
              <div className="flex gap-2"><button onClick={download} className="btn-primary text-xs px-4 py-2">{t('qrcode.download')}</button>
                <button onClick={copyImg} className="btn-outline text-xs px-4 py-2">{copied?t('qrcode.copied'):t('qrcode.copy')}</button></div>
            </div>
          ):(
            <div className="text-center text-gray-300"><div className="text-6xl mb-3">📫</div><p className="text-sm">{t('qrcode.hint')}</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
