'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useT } from '../../lib/LanguageContext';

export default function ResizePage(){
  const { t } = useT();
  const [preview,setPreview]=useState('');
  const [resultUrl,setResultUrl]=useState('');
  const [width,setWidth]=useState(800);
  const [height,setHeight]=useState(600);
  const [lock,setLock]=useState(true);
  const [origW,setOrigW]=useState(0);
  const [origH,setOrigH]=useState(0);
  const [processing,setProcessing]=useState(false);
  const [dragOver,setDragOver]=useState(false);
  const canvasRef=useRef<HTMLCanvasElement>(null!);
  const fileInputRef=useRef<HTMLInputElement>(null!);

  const handleFile=useCallback((file: File)=>{
    const reader=new FileReader();
    reader.onload=(e)=>{
      const url=e.target?.result as string;
      setPreview(url);setResultUrl('');
      const img=new window.Image();
      img.onload=()=>{setOrigW(img.naturalWidth);setOrigH(img.naturalHeight);setWidth(img.naturalWidth);setHeight(img.naturalHeight)};
      img.src=url;
    };
    reader.readAsDataURL(file);
  },[]);

  const handleDrop=useCallback((e: React.DragEvent)=>{
    e.preventDefault();e.stopPropagation();
    setDragOver(false);
    const file=e.dataTransfer.files[0];
    if(file&&file.type.startsWith('image/'))handleFile(file);
  },[handleFile]);

  const onW=(v: number)=>{setWidth(v);if(lock&&origW)setHeight(Math.round(v*origH/origW))};
  const onH=(v: number)=>{setHeight(v);if(lock&&origH)setWidth(Math.round(v*origW/origH))};

  const presets=[
    {label:t('tool.resize'),w:origW||800,h:origH||600},
    {label:'📱 Mobile',w:750,h:1334},
    {label:'🖥️ 1080p',w:1920,h:1080},
    {label:'📷 Avatar',w:400,h:400},
    {label:'🖼️ Thumb',w:300,h:300},
  ];

  useEffect(()=>{
    if(!preview)return;setProcessing(true);
    const timer=setTimeout(()=>{
      const img=new window.Image();
      img.onload=()=>{
        const c=canvasRef.current;c.width=width;c.height=height;
        c.getContext('2d')!.drawImage(img,0,0,width,height);
        c.toBlob(b=>{if(b)setResultUrl(URL.createObjectURL(b));setProcessing(false)},'image/png');
      };img.src=preview;
    },300);return ()=>clearTimeout(timer);
  },[preview,width,height]);

  const download=()=>{if(!resultUrl)return;const a=document.createElement('a');a.href=resultUrl;a.download='resized.png';a.click()};
  const reset=()=>{setPreview('');setResultUrl('');setOrigW(0);setOrigH(0)};

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-10 content-fade">
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-1">{t('tool.resize')}</h1>
      <p className="text-gray-400 text-sm mb-6">{t('tool.resize.desc')}</p>
      <canvas ref={canvasRef} className="hidden"/>
      {!preview?(
        <div className={'drop-zone '+(dragOver?'border-blue-500 bg-blue-50 shadow-[0_0_0_4px_rgba(59,130,246,.15)]':'')}
          onDragOver={e=>{e.preventDefault();setDragOver(true)}}
          onDragLeave={()=>setDragOver(false)}
          onDrop={handleDrop}
          onClick={()=>fileInputRef.current?.click()}>
          <div className="text-6xl drop-icon mb-4">{dragOver?'📥':'📁'}</div>
          <p className="text-gray-500 text-lg font-semibold mb-1">{dragOver?t('compress.drop2'):t('compress.drop')}</p>
          <p className="text-gray-400 text-sm">{t('compress.dropHint')}</p>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e=>e.target.files?.[0]&&handleFile(e.target.files[0])}/>
        </div>
     ):(
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card p-4"><p className="label mb-2">{t('compress.original')} · {origW}×{origH}px</p><div className="img-container"><img src={preview} alt="" className="img-preview"/></div></div>
            {resultUrl?<div className="card p-4 content-fade"><p className="label mb-2">{processing?t('compress.processing'):t('compress.result')+' · '+width+'×'+height+'px'}</p><div className="img-container"><img src={resultUrl} alt="" className="img-preview"/></div></div>
            :<div className="card p-4 flex items-center justify-center"><div className="animate-pulse text-indigo-400 text-4xl">⏳</div></div>}
          </div>
          <div className="card p-5 space-y-4">
            <div className="flex flex-wrap gap-2">{presets.map(p=>(
              <button key={p.label} onClick={()=>{setWidth(p.w);setHeight(p.h)}}
                className={'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all '+
                  (width===p.w&&height===p.h?'bg-blue-50 border-blue-300 text-blue-600':'border-gray-200 text-gray-500 hover:border-gray-300')}>
                {p.label} {p.w}×{p.h}
              </button>
            ))}</div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Width (px)</label><input type="number" value={width} onChange={e=>onW(+e.target.value)} className="input font-mono" min={1} max={10000}/></div>
              <div><label className="label">Height (px)</label><input type="number" value={height} onChange={e=>onH(+e.target.value)} className="input font-mono" min={1} max={10000}/></div>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
              <input type="checkbox" checked={lock} onChange={e=>setLock(e.target.checked)} className="w-4 h-4 rounded accent-blue-500"/> Lock Ratio
            </label>
            <div className="flex gap-2">
              {resultUrl&&<button onClick={download} className="btn-success">{t('compress.download')}</button>}
              <button onClick={reset} className="btn-ghost">{t('compress.reset')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
