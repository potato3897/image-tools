'use client';
import { useState, useMemo } from 'react';
import { useT } from '../../lib/LanguageContext';

function hexToRgb(hex: string): {r: number; g: number; b: number} { const r=parseInt(hex.slice(1,3),16);const g=parseInt(hex.slice(3,5),16);const b=parseInt(hex.slice(5,7),16);return{r,g,b};}
function rgbToHsl(r: number, g: number, b: number){r/=255;g/=255;b/=255;const max=Math.max(r,g,b),min=Math.min(r,g,b);let h=0,s=0;const l=(max+min)/2;if(max!==min){const d=max-min;s=l>.5?d/(2-max-min):d/(max+min);switch(max){case r:h=((g-b)/d+(g<b?6:0))/6;break;case g:h=((b-r)/d+2)/6;break;case b:h=((r-g)/d+4)/6}}return{h:Math.round(h*360),s:Math.round(s*100),l:Math.round(l*100)}}
function hslToString(h: number, s: number, l: number): string {return 'hsl(' + h + ', ' + s + '%, ' + l + '%)'}
function rgbToString(r: number, g: number, b: number): string {return 'rgb(' + r + ', ' + g + ', ' + b + ')'}

const presetColors = ['#3b82f6','#ef4444','#10b981','#f59e0b','#8b5cf6','#ec4899','#06b6d4','#f97316','#84cc16','#6366f1','#000000','#ffffff'];

export default function ColorPage(){
  const { t } = useT();
  const [hex,setHex]=useState('#3b82f6');
  const rgb = useMemo(()=>hexToRgb(hex),[hex]);
  const hsl = useMemo(()=>rgbToHsl(rgb.r,rgb.g,rgb.b),[rgb]);
  const [copied,setCopied]=useState('');

  const copy=(v: string, l: string)=>{navigator.clipboard.writeText(v);setCopied(l);setTimeout(()=>setCopied(''),1500)};

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-10 content-fade">
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-1">{t('tool.color')}</h1>
      <p className="text-gray-400 text-sm mb-6">{t('tool.color.desc')}</p>

      <div className="grid md:grid-cols-5 gap-4">
        <div className="card p-5 flex flex-col items-center gap-4 md:col-span-2">
          <div className="w-32 h-32 rounded-2xl shadow-inner border-4 border-white shadow-lg" style={{backgroundColor:hex}} />
          <input type="color" value={hex} onChange={e=>setHex(e.target.value)} className="w-16 h-10 cursor-pointer rounded-lg border-0" />
        </div>
        <div className="card p-5 space-y-3 md:col-span-3">
          {[
            {label:'HEX',value:hex,key:'hex'},
            {label:'RGB',value:rgbToString(rgb.r,rgb.g,rgb.b),key:'rgb'},
            {label:'HSL',value:hslToString(hsl.h,hsl.s,hsl.l),key:'hsl'},
          ].map(item=>(
            <div key={item.key} className="flex items-center gap-3">
              <span className="badge bg-blue-50 text-blue-600 w-14 justify-center">{item.label}</span>
              <code className="flex-1 bg-gray-50 rounded-xl px-4 py-2.5 text-sm font-mono">{item.value}</code>
              <button onClick={()=>copy(item.value,item.key)} className="btn-outline text-xs px-3 py-1.5">
                {copied===item.key?'✅':t('qrcode.copy').replace('📋 ','')}
              </button>
            </div>
          ))}
          <div className="pt-2">
            <label className="label">HEX</label>
            <input value={hex} onChange={e=>setHex(e.target.value)} className="input font-mono" placeholder="#000000" />
          </div>
        </div>
      </div>

      <div className="mt-6 card p-5">
        <p className="label mb-3">Presets</p>
        <div className="flex flex-wrap gap-2">
          {presetColors.map(c=>(
            <button key={c} onClick={()=>setHex(c)}
              className={'w-9 h-9 rounded-xl border-2 transition-all hover:scale-110 ' + (hex===c?'border-blue-500 ring-2 ring-blue-200 scale-110':'border-gray-200')}
              style={{backgroundColor:c}} title={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
