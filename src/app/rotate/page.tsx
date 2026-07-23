'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useT } from '../../lib/LanguageContext';

export default function RotatePage(){
  const { t } = useT();
  const [preview,setPreview]=useState('');
  const [resultUrl,setResultUrl]=useState('');
  const [angle,setAngle]=useState(0);
  const [processing,setProcessing]=useState(false);
  const [dragOver,setDragOver]=useState(false);
  const canvasRef=useRef<HTMLCanvasElement>(null!);
  const fileInputRef=useRef<HTMLInputElement>(null!);

  const handleFile=useCallback((file: File)=>{
    const reader=new FileReader();
    reader.onload=(e)=>{setPreview(e.target?.result as string);setResultUrl('');setAngle(0)};
    reader.readAsDataURL(file);
  },[]);

  const handleDrop=useCallback((e: React.DragEvent)=>{
    e.preventDefault();e.stopPropagation();
    setDragOver(false);
    const file=e.dataTransfer.files[0];
    if(file&&file.type.startsWith('image/'))handleFile(file);
  },[handleFile]);

  const rotate=()=>{
    if(!preview)return;
    const img=new window.Image();
    img.onload=()=>{
      const c=canvasRef.current;
      const rad=angle*Math.PI/180;
      const sw=img.naturalWidth,sh=img.naturalHeight;
      const cw=Math.abs(sw*Math.cos(rad))+Math.abs(sh*Math.sin(rad));
      const ch=Math.abs(sw*Math.sin(rad))+Math.abs(sh*Math.cos(rad));
      c.width=cw;c.height=ch;
      const ctx=c.getContext('2d')!;
      ctx.fillStyle='#fff';ctx.fillRect(0,0,cw,ch);
      ctx.translate(cw/2,ch/2);ctx.rotate(rad);
      ctx.drawImage(img,-sw/2,-sh/2);
      c.toBlob(b=>{if(b)setResultUrl(URL.createObjectURL(b))},'image/png');
    };img.src=preview;
  };

  useEffect(()=>{
    if(!preview)return;
    rotate();
  },[preview,angle]);

  const flip=(dir: 'h' | 'v')=>{
    if(!preview)return;
    const img=new window.Image();
    img.onload=()=>{
      const c=canvasRef.current;
      c.width=img.naturalWidth;c.height=img.naturalHeight;
      const ctx=c.getContext('2d')!;
      if(dir==='h'){ctx.translate(c.width,0);ctx.scale(-1,1)}
      else{ctx.translate(0,c.height);ctx.scale(1,-1)}
      ctx.drawImage(img,0,0);
      c.toBlob(b=>{if(b)setResultUrl(URL.createObjectURL(b))},'image/png');
    };img.src=preview;
  };

  const download=()=>{if(!resultUrl)return;const a=document.createElement('a');a.href=resultUrl;a.download='rotated.png';a.click()};
  const reset=()=>{setPreview('');setResultUrl('');setAngle(0)};

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-10 content-fade">
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-1">{t('tool.rotate')}</h1>
      <p className="text-gray-400 text-sm mb-6">{t('tool.rotate.desc')}</p>
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
            <div className="card p-4"><p className="label mb-2">{t('compress.original')}</p><div className="img-container"><img src={preview} alt="" className="img-preview" style={{transform:'rotate('+angle+'deg)',transition:'transform .3s ease'}}/></div></div>
            {resultUrl?<div className="card p-4 content-fade"><p className="label mb-2">{t('compress.result')}</p><div className="img-container"><img src={resultUrl} alt="" className="img-preview"/></div></div>
            :<div className="card p-4 flex items-center justify-center"><div className="animate-pulse text-rose-400 text-4xl">⏳</div></div>}
          </div>
          <div className="card p-5 space-y-4">
            <div>
              <label className="label mb-2">Angle: {angle}°</label>
              <input type="range" min="-180" max="180" value={angle} onChange={e=>setAngle(+e.target.value)}
                className="w-full accent-blue-500 h-3 rounded-full appearance-none bg-gray-200 cursor-pointer" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                {[-180,-90,-45,0,45,90,180].map(a=><button key={a} onClick={()=>setAngle(a)} className={'px-2 py-0.5 rounded '+(angle===a?'bg-blue-50 text-blue-600 font-bold':'')}>{a}°</button>)}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={()=>flip('h')} className="btn-outline">↔️ Flip H</button>
              <button onClick={()=>flip('v')} className="btn-outline">↕️ Flip V</button>
              {resultUrl&&<button onClick={download} className="btn-success">{t('compress.download')}</button>}
              <button onClick={reset} className="btn-ghost ml-auto">{t('compress.reset')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
