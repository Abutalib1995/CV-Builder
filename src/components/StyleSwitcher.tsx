import React from 'react';
import { CVData } from '../types';
import { ACCENT_COLORS } from '../data';
import { Layout, Palette, Type, Check, Plus, Minus, AlignJustify, AlignLeft, AlignCenter, Maximize, Zap, RefreshCw } from 'lucide-react';
import { getFontScaleNumber, getLineSpacingNumber, getPageMarginNumber } from './CVTemplates';

interface StyleSwitcherProps {
  metadata: CVData['metadata'];
  onChange: (updatedMetadata: CVData['metadata']) => void;
}

export default function StyleSwitcher({ metadata, onChange }: StyleSwitcherProps) {
  const currentFontScale = getFontScaleNumber(metadata.fontSize);
  const currentLineSpacing = getLineSpacingNumber(metadata.lineSpacing);
  const currentPageMargin = getPageMarginNumber(metadata.pageMargin);

  const updateFontScale = (newScale: number) => {
    const clamped = Math.max(40, Math.min(125, newScale));
    onChange({ ...metadata, fontSize: clamped });
  };

  const updateLineSpacing = (newSpacing: number) => {
    const clamped = Math.max(40, Math.min(130, newSpacing));
    onChange({ ...metadata, lineSpacing: clamped });
  };

  const updatePageMargin = (newMargin: number) => {
    const clamped = Math.max(30, Math.min(120, newMargin));
    onChange({ ...metadata, pageMargin: clamped });
  };

  // Quick preset helper to fit on 1 page or reset
  const applyOnePageFit = () => {
    onChange({
      ...metadata,
      fontSize: 80,
      lineSpacing: 60,
      pageMargin: 50,
    });
  };

  const applyResetStandard = () => {
    onChange({
      ...metadata,
      fontSize: 100,
      lineSpacing: 100,
      pageMargin: 100,
    });
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
    <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 space-y-5 shadow-xs">
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

      {/* Quick 1-Page Fit Preset Bar */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-sky-50 border border-indigo-100 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-indigo-600 fill-indigo-500 shrink-0" />
          <div>
            <span className="text-xs font-bold text-indigo-950 block leading-none">
              Quick 1-Page Fit (১ পেজে সিভি সেট করার বোতাম)
            </span>
            <span className="text-[11px] text-slate-500 font-medium leading-tight">
              ২ পেজের সিভি সহজে ১ পেজে ছোট করতে এই বাটন চাপুন
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={applyOnePageFit}
            className="px-3 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="১ পেজে ফিট করতে ফন্ট, লাইন ও মার্জিন স্বয়ংক্রিয়ভাবে কমাবে"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>১ পেজে ফিট করুন (Auto Fit)</span>
          </button>

          <button
            type="button"
            onClick={applyResetStandard}
            className="px-2.5 py-1.5 text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            title="স্বাভাবিক ১০০% রিসেট করুন"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>রিসেট (100%)</span>
          </button>
        </div>
      </div>

      {/* 2. Independent Controls: Font Size, Line Spacing, Page Margin, Text Justify & Color */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2 border-t border-slate-100">
        
        {/* CONTROL 1: Font Size Scale (%) */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-purple-600" />
              <span>Font Size (ফন্ট সাইজ)</span>
            </label>
            <span className="text-xs font-extrabold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md font-mono">
              {currentFontScale}%
            </span>
          </div>

          <div className="flex flex-wrap gap-1">
            {[50, 60, 70, 80, 90, 100, 110, 120].map((scaleVal) => {
              const isSelected = currentFontScale === scaleVal;
              return (
                <button
                  key={scaleVal}
                  type="button"
                  onClick={() => updateFontScale(scaleVal)}
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {scaleVal}%
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => updateFontScale(currentFontScale - 1)}
              className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer shrink-0"
              title="1% কমান"
            >
              <Minus className="w-3 h-3" />
            </button>

            <input
              type="range"
              min="40"
              max="120"
              step="1"
              value={currentFontScale}
              onChange={(e) => updateFontScale(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />

            <button
              type="button"
              onClick={() => updateFontScale(currentFontScale + 1)}
              className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer shrink-0"
              title="1% বাড়ান"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* CONTROL 2: Line Spacing Scale (%) */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <AlignJustify className="w-3.5 h-3.5 text-blue-600" />
              <span>Line Spacing (লাইন স্পেস)</span>
            </label>
            <span className="text-xs font-extrabold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md font-mono">
              {currentLineSpacing}%
            </span>
          </div>

          <div className="flex flex-wrap gap-1">
            {[40, 50, 60, 70, 80, 90, 100, 115].map((spacingVal) => {
              const isSelected = currentLineSpacing === spacingVal;
              return (
                <button
                  key={spacingVal}
                  type="button"
                  onClick={() => updateLineSpacing(spacingVal)}
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {spacingVal}%
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => updateLineSpacing(currentLineSpacing - 1)}
              className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer shrink-0"
              title="1% কমান"
            >
              <Minus className="w-3 h-3" />
            </button>

            <input
              type="range"
              min="40"
              max="130"
              step="1"
              value={currentLineSpacing}
              onChange={(e) => updateLineSpacing(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />

            <button
              type="button"
              onClick={() => updateLineSpacing(currentLineSpacing + 1)}
              className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer shrink-0"
              title="1% বাড়ান"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* CONTROL 3: Page Margin / Padding (%) */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Maximize className="w-3.5 h-3.5 text-emerald-600" />
              <span>Page Margin (পেজ মার্জিন)</span>
            </label>
            <span className="text-xs font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-mono">
              {currentPageMargin}%
            </span>
          </div>

          <div className="flex flex-wrap gap-1">
            {[30, 40, 50, 60, 70, 80, 90, 100].map((marginVal) => {
              const isSelected = currentPageMargin === marginVal;
              return (
                <button
                  key={marginVal}
                  type="button"
                  onClick={() => updatePageMargin(marginVal)}
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {marginVal}%
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => updatePageMargin(currentPageMargin - 1)}
              className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer shrink-0"
              title="1% কমান"
            >
              <Minus className="w-3 h-3" />
            </button>

            <input
              type="range"
              min="30"
              max="120"
              step="1"
              value={currentPageMargin}
              onChange={(e) => updatePageMargin(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />

            <button
              type="button"
              onClick={() => updatePageMargin(currentPageMargin + 1)}
              className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer shrink-0"
              title="1% বাড়ান"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* CONTROL 4: Text Justify & Alignment (টেক্সট জাস্টিফাই অপশন) */}
        <div className="bg-slate-50/70 border border-indigo-200/80 rounded-xl p-3 space-y-2 ring-1 ring-indigo-500/10">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <AlignJustify className="w-3.5 h-3.5 text-indigo-600" />
              <span>Text Justify (জাস্টিফাই)</span>
            </label>
            <span className="text-[10px] font-extrabold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md font-mono uppercase">
              {metadata.textAlign || 'justify'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1 pt-0.5">
            <button
              type="button"
              onClick={() => onChange({ ...metadata, textAlign: 'justify' })}
              className={`flex flex-col items-center justify-center p-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                (metadata.textAlign || 'justify') === 'justify'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="উভয় পাশে সমান মার্জিন (Justify Alignment)"
            >
              <AlignJustify className="w-4 h-4 mb-0.5" />
              <span>Justify</span>
            </button>

            <button
              type="button"
              onClick={() => onChange({ ...metadata, textAlign: 'left' })}
              className={`flex flex-col items-center justify-center p-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                metadata.textAlign === 'left'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="বাম দিকে সোজা (Left Alignment)"
            >
              <AlignLeft className="w-4 h-4 mb-0.5" />
              <span>Left</span>
            </button>

            <button
              type="button"
              onClick={() => onChange({ ...metadata, textAlign: 'center' })}
              className={`flex flex-col items-center justify-center p-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                metadata.textAlign === 'center'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="মাঝখানে সোজা (Center Alignment)"
            >
              <AlignCenter className="w-4 h-4 mb-0.5" />
              <span>Center</span>
            </button>
          </div>

          <p className="text-[10px] text-slate-500 font-medium leading-tight pt-0.5">
            ডানে ও বামে লাইন সমান রাখতে <strong className="text-indigo-700">Justify</strong> নির্বাচন করুন।
          </p>
        </div>

      </div>

      {/* 3. Brand Theme Color Accent Selector */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-amber-500" />
            <span>Brand Theme Color (কালার থিম)</span>
          </label>
        </div>

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
    </div>
  );
}

