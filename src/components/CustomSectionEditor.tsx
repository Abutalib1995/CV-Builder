import React from 'react';
import { CVData, CustomSection, CustomSectionItem } from '../types';
import { Plus, Trash2, Edit3 } from 'lucide-react';

interface CustomSectionEditorProps {
  section: CustomSection;
  data: CVData;
  onUpdate: (updatedData: CVData) => void;
}

export default function CustomSectionEditor({
  section,
  data,
  onUpdate
}: CustomSectionEditorProps) {

  // Update Section Title
  const handleTitleChange = (newTitle: string) => {
    const updatedCustoms = (data.customSections || []).map(c => {
      if (c.id === section.id) {
        return { ...c, title: newTitle };
      }
      return c;
    });
    onUpdate({ ...data, customSections: updatedCustoms });
  };

  // Add Item to Custom Section
  const handleAddItem = () => {
    const newItem: CustomSectionItem = {
      id: `item-${Date.now()}`,
      title: '',
      subtitle: '',
      date: '',
      description: ''
    };

    const updatedCustoms = (data.customSections || []).map(c => {
      if (c.id === section.id) {
        return { ...c, items: [...c.items, newItem] };
      }
      return c;
    });

    onUpdate({ ...data, customSections: updatedCustoms });
  };

  // Update Item in Custom Section
  const handleUpdateItem = (itemId: string, field: keyof CustomSectionItem, value: string) => {
    const updatedCustoms = (data.customSections || []).map(c => {
      if (c.id === section.id) {
        const updatedItems = c.items.map(item => {
          if (item.id === itemId) {
            return { ...item, [field]: value };
          }
          return item;
        });
        return { ...c, items: updatedItems };
      }
      return c;
    });

    onUpdate({ ...data, customSections: updatedCustoms });
  };

  // Remove Item from Custom Section
  const handleRemoveItem = (itemId: string) => {
    const updatedCustoms = (data.customSections || []).map(c => {
      if (c.id === section.id) {
        return {
          ...c,
          items: c.items.filter(item => item.id !== itemId)
        };
      }
      return c;
    });

    onUpdate({ ...data, customSections: updatedCustoms });
  };

  // Remove Entire Custom Section
  const handleRemoveSection = () => {
    if (!confirm(`আপনি কি "${section.title}" সেকশনটি মুছে ফেলতে চান?`)) return;

    const updatedCustoms = (data.customSections || []).filter(c => c.id !== section.id);
    const updatedOrder = (data.sectionOrder || []).filter(id => id !== section.id);
    const updatedHidden = (data.hiddenSections || []).filter(id => id !== section.id);

    onUpdate({
      ...data,
      customSections: updatedCustoms,
      sectionOrder: updatedOrder,
      hiddenSections: updatedHidden
    });
  };

  return (
    <div className="p-4 border-t border-slate-100 space-y-4">
      {/* Items List */}
      <div className="space-y-4">
        {section.items.map((item, index) => (
          <div 
            key={item.id} 
            className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 space-y-3 relative group"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                আইটেম #{index + 1}
              </span>

              {section.items.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-xs text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> মুছে ফেলুন
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Title */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-600">
                  শিরোনাম / বিষয় (Title / Subject)
                </label>
                <input
                  type="text"
                  value={item.title || ''}
                  onChange={(e) => handleUpdateItem(item.id, 'title', e.target.value)}
                  placeholder="যেমন: AWS Architect / Research Paper Title"
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                />
              </div>

              {/* Subtitle / Organization */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-600">
                  প্রতিষ্ঠান / সাবটাইটেল (Organization / Subtitle)
                </label>
                <input
                  type="text"
                  value={item.subtitle || ''}
                  onChange={(e) => handleUpdateItem(item.id, 'subtitle', e.target.value)}
                  placeholder="যেমন: Amazon Web Services / IEEE Journal"
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                />
              </div>
            </div>

            {/* Date */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-slate-600">
                তারিখ / বছর (Date / Duration)
              </label>
              <input
                type="text"
                value={item.date || ''}
                onChange={(e) => handleUpdateItem(item.id, 'date', e.target.value)}
                placeholder="যেমন: 2023 বা Jan 2022 - Present"
                className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-slate-600">
                বিস্তারিত বর্ণনা (Description & Key Highlights)
              </label>
              <textarea
                rows={2}
                value={item.description || ''}
                onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                placeholder="সংক্ষিপ্ত বিবরণ বা বুলেট পয়েন্ট আকারে লিখুন..."
                className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="flex justify-between items-center pt-2">
        <button
          type="button"
          onClick={handleAddItem}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs rounded-xl transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-amber-600" />
          <span>আরও আইটেম যোগ করুন</span>
        </button>

        <button
          type="button"
          onClick={handleRemoveSection}
          className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 font-bold cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>পুরো সেকশন মুছে ফেলুন</span>
        </button>
      </div>
    </div>
  );
}
