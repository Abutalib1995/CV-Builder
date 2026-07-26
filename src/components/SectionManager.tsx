import React, { useState } from 'react';
import { CVData, CustomSection } from '../types';
import { 
  getEffectiveSectionOrder, 
  getSectionDisplayTitle, 
  STANDARD_SECTION_LABELS, 
  CUSTOM_SECTION_PRESETS 
} from '../lib/sectionUtils';
import { 
  ArrowUp, ArrowDown, Eye, EyeOff, Plus, Trash2, 
  Layers, ChevronDown, ChevronUp, Sparkles, Move, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SectionManagerProps {
  data: CVData;
  onUpdate: (updatedData: CVData) => void;
  onSelectSection?: (sectionId: string) => void;
}

export default function SectionManager({ data, onUpdate, onSelectSection }: SectionManagerProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [customTitleInput, setCustomTitleInput] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  const order = getEffectiveSectionOrder(data);
  const hiddenSections = data.hiddenSections || [];

  // Move section UP
  const handleMoveUp = (secId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const index = order.indexOf(secId);
    if (index <= 0) return;
    const newOrder = [...order];
    const temp = newOrder[index - 1];
    newOrder[index - 1] = newOrder[index];
    newOrder[index] = temp;
    onUpdate({ ...data, sectionOrder: newOrder });
  };

  // Move section DOWN
  const handleMoveDown = (secId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const index = order.indexOf(secId);
    if (index < 0 || index >= order.length - 1) return;
    const newOrder = [...order];
    const temp = newOrder[index + 1];
    newOrder[index + 1] = newOrder[index];
    newOrder[index] = temp;
    onUpdate({ ...data, sectionOrder: newOrder });
  };

  // Toggle Visibility (Eye / EyeOff)
  const handleToggleVisibility = (secId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isHidden = hiddenSections.includes(secId);
    const newHidden = isHidden 
      ? hiddenSections.filter(id => id !== secId) 
      : [...hiddenSections, secId];
    onUpdate({ ...data, hiddenSections: newHidden });
  };

  // Add Custom Section
  const handleAddCustomSection = (titleToAdd?: string) => {
    const finalTitle = (titleToAdd || customTitleInput).trim();
    if (!finalTitle) return;

    const newId = `custom-${Date.now()}`;
    const newCustomSection: CustomSection = {
      id: newId,
      title: finalTitle,
      items: [
        {
          id: `item-${Date.now()}`,
          title: '',
          subtitle: '',
          date: '',
          description: ''
        }
      ]
    };

    const updatedCustoms = [...(data.customSections || []), newCustomSection];
    const updatedOrder = [...order, newId];

    onUpdate({
      ...data,
      customSections: updatedCustoms,
      sectionOrder: updatedOrder
    });

    setCustomTitleInput('');
    setSelectedPreset('');

    if (onSelectSection) {
      onSelectSection(newId);
    }
  };

  // Delete Custom Section
  const handleDeleteCustomSection = (secId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('আপনি কি সত্যিই এই সেকশনটি মুছে ফেলতে চান?')) return;

    const updatedCustoms = (data.customSections || []).filter(c => c.id !== secId);
    const updatedOrder = order.filter(id => id !== secId);
    const updatedHidden = hiddenSections.filter(id => id !== secId);

    onUpdate({
      ...data,
      customSections: updatedCustoms,
      sectionOrder: updatedOrder,
      hiddenSections: updatedHidden
    });
  };

  return (
    <div className="border-2 border-purple-200 rounded-xl overflow-hidden bg-gradient-to-b from-purple-50/40 to-white shadow-xs">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3.5 font-bold text-sm text-purple-900 hover:bg-purple-50/80 transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-purple-600 text-white rounded-lg shadow-2xs">
            <Layers className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-800 text-sm">
                সেকশন সিকোয়েন্স ও সাজানো (Rearrange Sections)
              </span>
              <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-mono">
                {order.length}টি সেকশন
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-normal">
              সেকশন উপরে-নিচে নামাতে [↑] [↓] চাপুন বা নতুন সেকশন যোগ করুন
            </p>
          </div>
        </div>

        {isOpen ? <ChevronUp className="w-4 h-4 text-purple-600" /> : <ChevronDown className="w-4 h-4 text-purple-600" />}
      </button>

      {/* Accordion Body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3.5 border-t border-purple-100 space-y-3 bg-white">
              
              {/* Reorderable Section Items List */}
              <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                {order.map((secId, index) => {
                  const isHidden = hiddenSections.includes(secId);
                  const isCustom = secId.startsWith('custom-');
                  const displayTitle = getSectionDisplayTitle(secId, data);
                  const labelMeta = STANDARD_SECTION_LABELS[secId];

                  return (
                    <div
                      key={secId}
                      className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                        isHidden 
                          ? 'bg-slate-50 border-slate-200 opacity-60' 
                          : 'bg-white border-slate-200 hover:border-purple-300 shadow-2xs'
                      }`}
                    >
                      {/* Left: Move Handles & Name */}
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-[10px] font-mono font-bold text-slate-400 w-4 text-center shrink-0">
                          #{index + 1}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-xs font-bold truncate ${isHidden ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                              {displayTitle}
                            </span>
                            {isCustom && (
                              <span className="text-[9px] font-extrabold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded uppercase shrink-0">
                                কাস্টম
                              </span>
                            )}
                          </div>
                          {labelMeta?.bn && !isCustom && (
                            <span className="text-[10px] text-slate-400 block truncate">
                              {labelMeta.bn}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions (Up, Down, Hide/Show, Delete) */}
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        {/* Up Button */}
                        <button
                          type="button"
                          onClick={(e) => handleMoveUp(secId, e)}
                          disabled={index === 0}
                          className="p-1 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-700 disabled:opacity-30 disabled:hover:bg-slate-100 transition-colors cursor-pointer disabled:cursor-not-allowed"
                          title="উপরে তুলুন (Move Up)"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>

                        {/* Down Button */}
                        <button
                          type="button"
                          onClick={(e) => handleMoveDown(secId, e)}
                          disabled={index === order.length - 1}
                          className="p-1 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-700 disabled:opacity-30 disabled:hover:bg-slate-100 transition-colors cursor-pointer disabled:cursor-not-allowed"
                          title="নিচে নামান (Move Down)"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Visibility Toggle */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleVisibility(secId, e)}
                          className={`p-1 rounded-lg transition-colors cursor-pointer ${
                            isHidden
                              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                          }`}
                          title={isHidden ? 'সিভিতে দেখান (Show in CV)' : 'সিভিতে লুকান (Hide from CV)'}
                        >
                          {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>

                        {/* Custom Section Delete */}
                        {isCustom && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteCustomSection(secId, e)}
                            className="p-1 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="সেকশনটি মুছুন (Delete Custom Section)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Custom Section Area */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <label className="block text-xs font-bold text-purple-900 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-purple-600" />
                  <span>নতুন যেকোনো সেকশন যোগ করুন (Add Custom Section)</span>
                </label>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {CUSTOM_SECTION_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setSelectedPreset(preset.title);
                        setCustomTitleInput(preset.title);
                      }}
                      className="text-[10px] font-bold px-2 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-100 transition-colors cursor-pointer"
                    >
                      + {preset.title.split(' (')[0]}
                    </button>
                  ))}
                </div>

                {/* Title Input & Add Button */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={customTitleInput}
                    onChange={(e) => setCustomTitleInput(e.target.value)}
                    placeholder="যেমন: Certifications, Projects, Publications..."
                    className="flex-1 text-xs border border-slate-200 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomSection();
                      }
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => handleAddCustomSection()}
                    disabled={!customTitleInput.trim()}
                    className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer shrink-0 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>যোগ করুন</span>
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
