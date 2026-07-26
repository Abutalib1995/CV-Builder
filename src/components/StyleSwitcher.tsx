import React from 'react';
import { CVData } from '../types';
import { ACCENT_COLORS } from '../data';
import { Layout, Palette, Type, Check, Plus, Minus } from 'lucide-react';
import { getFontScaleNumber } from './CVTemplates';

interface StyleSwitcherProps {
  metadata: CVData['metadata'];
  onChange: (updatedMetadata: CVData['metadata']) => void;
}

export default function StyleSwitcher({ metadata, onChange }: StyleSwitcherProps) {
  const currentFontScale = getFontScaleNumber(metadata.fontSize);

  const updateFontScale = (newScale: number) => {
    const clamped = Math.max(50, Math.min(125, newScale));
    onChange({ ...metadata, fontSize: clamped });
  };
  const templates = [
    {
      id: 'academic' as const,
      name: 'Academic & Professional',
      desc: 'Clean centered header, circular photo, blue section titles with right rule lines.',
      previewBg: 'bg-sky-600',
      fontClass: 'font-sans'
    },
    {
      id: 'classic' as const,
      name: 'Europass Standard',
      desc: 'Highly structured, official European format with timeline bars.',
      previewBg: 'bg-indigo-900',
      fontClass: 'font-sans'
    },
    {
      id: 'modern' as const,
      name: 'Swiss Minimal',
      desc: 'Sleek asymmetric grid layout with a colored sidebar.',
      previewBg: 'bg-zinc-800',
      fontClass: 'font-sans font-bold'
    },
    {
      id: 'creative' as const,
      name: 'Parisian Chic',
      desc: 'Elegant editorial design with serif fonts and warm backgrounds.',
      previewBg: 'bg-purple-950',
      fontClass: 'font-serif italic'
    },
    {
      id: 'editorial' as const,
      name: 'Harvard Editorial',
      desc: 'Elegant, academic layout with classic serif and double rules.',
      previewBg: 'bg-stone-800',
      fontClass: 'font-serif'
    },
    {
      id: 'tech' as const,
      name: 'Modern Tech Dev',
      desc: 'Developer focused tag styling and monospace accents.',
      previewBg: 'bg-slate-800',
      fontClass: 'font-mono'
    },
    {
      id: 'vibrant' as const,
      name: 'Vibrant Startup Sidebar',
      desc: 'Modern side-gradient design with outstanding layout flow.',
      previewBg: 'bg-rose-500',
      fontClass: 'font-sans'
    },
    {
      id: 'elegant' as const,
      name: 'Elite Executive Royale',
      desc: 'High-contrast header block with thin professional margins.',
      previewBg: 'bg-amber-700',
      fontClass: 'font-sans'
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 space-y-4 shadow-xs">
      {/* 1. Template Chooser Header & Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Layout className="w-4 h-4 text-indigo-600" />
            <span>Choose CV Layout Style (সিভি লেআউট স্টাইল)</span>
          </label>
          <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
            ৮টি প্রফেশনাল ইউরোপীয়ান ও গ্লোবাল টেমপ্লেট
          </span>
        </div>
        
        {/* Responsive Grid: 2 cols on mobile, 4 on tablet, 8 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {templates.map((tpl) => {
            const isSelected = metadata.templateId === tpl.id;
            return (
              <button
                key={tpl.id}
                id={`template-select-${tpl.id}`}
                onClick={() => onChange({ ...metadata, templateId: tpl.id })}
                className={`flex flex-col text-left p-2.5 rounded-xl border-2 transition-all cursor-pointer select-none group relative ${
                  isSelected 
                    ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600 shadow-xs' 
                    : 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                {/* Visual Accent Indicator */}
                <div className="flex justify-between items-center mb-1.5">
                  <span className={`text-[9px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded ${
                    tpl.id === 'academic' ? 'bg-sky-100 text-sky-700' :
                    tpl.id === 'classic' ? 'bg-blue-100 text-blue-700' : 
                    tpl.id === 'modern' ? 'bg-zinc-100 text-zinc-700' : 
                    tpl.id === 'creative' ? 'bg-purple-100 text-purple-700' :
                    tpl.id === 'editorial' ? 'bg-amber-100 text-amber-700' : 
                    tpl.id === 'tech' ? 'bg-cyan-100 text-cyan-700' :
                    tpl.id === 'vibrant' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {tpl.id}
                  </span>
                  {isSelected && (
                    <span className="w-3.5 h-3.5 bg-indigo-600 rounded-full flex items-center justify-center text-white shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3px]" />
                    </span>
                  )}
                </div>

                <div className={`text-[11px] font-bold text-slate-800 ${tpl.fontClass} group-hover:text-indigo-900 transition-colors truncate`}>
                  {tpl.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2 & 3: Color Accents & Font Scale Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
        {/* Brand Theme Color */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-emerald-500" />
            <span>Brand Theme Color</span>
          </label>
          
          <div className="flex flex-wrap items-center gap-2">
            {ACCENT_COLORS.map((color) => {
              const isSelected = metadata.accentColor.toLowerCase() === color.value.toLowerCase();
              return (
                <button
                  key={color.value}
                  onClick={() => onChange({ ...metadata, accentColor: color.value })}
                  className="w-6 h-6 rounded-full flex items-center justify-center border border-slate-200 transition-transform hover:scale-110 relative cursor-pointer"
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  {isSelected && (
                    <span className="w-3.5 h-3.5 rounded-full bg-white/90 shadow-xs flex items-center justify-center text-slate-800">
                      <Check className="w-2 h-2 stroke-[3px]" style={{ color: color.value }} />
                    </span>
                  )}
                </button>
              );
            })}
            
            {/* Custom Color Input */}
            <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-200">
              <input
                type="color"
                value={metadata.accentColor}
                onChange={(e) => onChange({ ...metadata, accentColor: e.target.value })}
                className="w-6 h-6 rounded-full border border-slate-200 cursor-pointer overflow-hidden bg-transparent"
                title="Custom hex color"
              />
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">{metadata.accentColor}</span>
            </div>
          </div>
        </div>

        {/* Font Scaling (%) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-purple-500" />
              <span>Font & Line Gap Scale (%)</span>
            </label>
            <span className="text-xs font-extrabold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md font-mono">
              {currentFontScale}%
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Presets */}
            <div className="flex flex-wrap gap-1">
              {[50, 60, 70, 80, 90, 100, 110, 120].map((scaleVal) => {
                const isSelected = currentFontScale === scaleVal;
                return (
                  <button
                    key={scaleVal}
                    type="button"
                    onClick={() => updateFontScale(scaleVal)}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {scaleVal}%
                  </button>
                );
              })}
            </div>

            {/* Slider & Fine buttons */}
            <div className="flex items-center gap-1.5 flex-1 min-w-[140px]">
              <button
                type="button"
                onClick={() => updateFontScale(currentFontScale - 1)}
                className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer shrink-0"
                title="1% কমান"
              >
                <Minus className="w-3 h-3" />
              </button>

              <input
                type="range"
                min="50"
                max="120"
                step="1"
                value={currentFontScale}
                onChange={(e) => updateFontScale(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />

              <button
                type="button"
                onClick={() => updateFontScale(currentFontScale + 1)}
                className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer shrink-0"
                title="1% বাড়ান"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
