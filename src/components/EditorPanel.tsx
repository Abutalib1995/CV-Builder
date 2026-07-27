import React, { useState, useRef, useEffect } from 'react';
import { CVData, Language, WorkExperience, Education, Reference, CustomSection } from '../types';
import { CEFR_LEVELS } from '../data';
import { 
  User, Briefcase, GraduationCap, Wrench, Languages, 
  Plus, Trash2, ChevronDown, ChevronUp, Upload, 
  RefreshCw, Sparkles, AlertCircle, Users,
  Crop, Edit2, ArrowUp, ArrowDown, Eye, EyeOff, Check, FileText, X,
  Award, BookOpen, Layers, FolderPlus, RotateCcw, AlignJustify
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import PhotoCropModal from './PhotoCropModal';
import CustomSectionEditor from './CustomSectionEditor';
import { 
  getEffectiveSectionOrder, 
  getSectionDisplayTitle, 
  STANDARD_SECTION_LABELS, 
  CUSTOM_SECTION_PRESETS 
} from '../lib/sectionUtils';

interface TextFormattingToolbarProps {
  label: string;
  hint?: string;
  value: string;
  onChangeValue: (val: string) => void;
  textAlign?: 'justify' | 'left' | 'center';
  onChangeTextAlign?: (align: 'justify' | 'left' | 'center') => void;
  showBulletButton?: boolean;
}

export function TextFormattingToolbar({
  label,
  hint,
  value,
  onChangeValue,
  textAlign = 'justify',
  onChangeTextAlign,
  showBulletButton = true
}: TextFormattingToolbarProps) {
  const handleInsertBullet = () => {
    if (!value) {
      onChangeValue('• ');
      return;
    }
    if (value.endsWith('\n')) {
      onChangeValue(value + '• ');
    } else {
      onChangeValue(value + '\n• ');
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
      <div>
        <label className="block text-xs font-bold text-slate-700">
          {label}
        </label>
        {hint && <span className="block text-[10px] text-slate-400 font-normal">{hint}</span>}
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {showBulletButton && (
          <button
            type="button"
            onClick={handleInsertBullet}
            className="text-[10px] font-bold text-slate-700 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 rounded-md px-2 py-0.5 transition-colors cursor-pointer flex items-center gap-1"
            title="নতুন বুলেট পয়েন্ট (•) যোগ করুন"
          >
            <span className="font-mono text-indigo-600 font-extrabold">•</span>
            <span>বুলেট যোগ করুন</span>
          </button>
        )}

        {onChangeTextAlign && (
          <button
            type="button"
            onClick={() => {
              const nextAlign = textAlign === 'justify' ? 'left' : 'justify';
              onChangeTextAlign(nextAlign);
            }}
            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border transition-colors cursor-pointer flex items-center gap-1 ${
              textAlign === 'justify'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="সিভিতে উভয় দিকে মার্জিন সোজা রাখতে (Justify) টগল করুন"
          >
            <AlignJustify className="w-3 h-3" />
            <span>{textAlign === 'justify' ? 'Justify: ON' : 'Justify: OFF'}</span>
          </button>
        )}
      </div>
    </div>
  );
}

interface EditorPanelProps {
  data: CVData;
  onUpdate: (updatedData: CVData) => void;
  onClear: () => void;
  onRestore: () => void;
}

interface SectionCardHeaderProps {
  secId: string;
  defaultTitle: string;
  icon: React.ReactNode;
  data: CVData;
  onUpdate: (updatedData: CVData) => void;
  activeSection: string;
  toggleSection: (secId: string) => void;
  index: number;
  totalSections: number;
  countBadge?: number;
  isCustom?: boolean;
  onDeleteCustom?: () => void;
}

function SectionCardHeader({
  secId,
  defaultTitle,
  icon,
  data,
  onUpdate,
  activeSection,
  toggleSection,
  index,
  totalSections,
  countBadge,
  isCustom,
  onDeleteCustom
}: SectionCardHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const displayTitle = getSectionDisplayTitle(secId, data);
  const [tempTitle, setTempTitle] = useState(displayTitle);

  const hiddenSections = data.hiddenSections || [];
  const isHidden = hiddenSections.includes(secId);
  const order = getEffectiveSectionOrder(data);

  useEffect(() => {
    setTempTitle(displayTitle);
  }, [displayTitle]);

  const handleSaveTitle = () => {
    setIsEditingTitle(false);
    const trimmed = tempTitle.trim();
    if (isCustom) {
      const updatedCustoms = (data.customSections || []).map(c => 
        c.id === secId ? { ...c, title: trimmed || 'Custom Section' } : c
      );
      onUpdate({ ...data, customSections: updatedCustoms });
    } else {
      onUpdate({
        ...data,
        sectionTitles: {
          ...(data.sectionTitles || {}),
          [secId]: trimmed
        }
      });
    }
  };

  const handleResetTitle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingTitle(false);
    if (!isCustom) {
      const newTitles = { ...(data.sectionTitles || {}) };
      delete newTitles[secId];
      onUpdate({ ...data, sectionTitles: newTitles });
      setTempTitle(defaultTitle);
    }
  };

  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (index <= 0) return;
    const newOrder = [...order];
    const temp = newOrder[index - 1];
    newOrder[index - 1] = newOrder[index];
    newOrder[index] = temp;
    onUpdate({ ...data, sectionOrder: newOrder });
  };

  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (index < 0 || index >= totalSections - 1) return;
    const newOrder = [...order];
    const temp = newOrder[index + 1];
    newOrder[index + 1] = newOrder[index];
    newOrder[index] = temp;
    onUpdate({ ...data, sectionOrder: newOrder });
  };

  const handleToggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newHidden = isHidden
      ? hiddenSections.filter(id => id !== secId)
      : [...hiddenSections, secId];
    onUpdate({ ...data, hiddenSections: newHidden });
  };

  const isActive = activeSection === secId;

  return (
    <div 
      className={`flex flex-wrap sm:flex-nowrap items-center justify-between p-3.5 border-b border-slate-150 transition-colors select-none ${
        isHidden ? 'bg-slate-100/70' : 'bg-slate-50/70 hover:bg-slate-50'
      }`}
    >
      {/* Left: Index + Icon + Title + Inline Edit */}
      <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
        <span className="text-[10px] font-mono font-bold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded-md shrink-0">
          #{index + 1}
        </span>

        <div className="shrink-0">{icon}</div>

        {isEditingTitle ? (
          <div className="flex items-center gap-1.5 min-w-0 flex-1" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              placeholder="হেডলাইন লিখুন (e.g. আমার অভিজ্ঞতা)"
              className="text-xs font-bold text-slate-800 border border-indigo-400 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white w-full max-w-[220px]"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle();
                if (e.key === 'Escape') setIsEditingTitle(false);
              }}
            />
            <button
              type="button"
              onClick={handleSaveTitle}
              className="p-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors cursor-pointer shrink-0"
              title="শিরোনাম সেভ করুন"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            {!isCustom && data.sectionTitles?.[secId] && (
              <button
                type="button"
                onClick={handleResetTitle}
                className="p-1 text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-md transition-colors cursor-pointer shrink-0"
                title="আগের ডিফল্ট শিরোনামে ফিরে যান"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
            <button
              type="button"
              onClick={() => toggleSection(secId)}
              className="text-left font-bold text-xs sm:text-sm text-slate-800 hover:text-indigo-600 transition-colors truncate cursor-pointer flex items-center gap-1.5"
            >
              <span className={isHidden ? 'line-through text-slate-400' : ''}>{displayTitle}</span>
              {isHidden && (
                <span className="text-[9px] font-extrabold bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded uppercase shrink-0">
                  Hidden
                </span>
              )}
            </button>

            {/* Edit Title Pencil Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingTitle(true);
              }}
              className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer shrink-0"
              title="হেডলাইন বা শিরোনাম এডিট করুন (Edit Title)"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>

            {countBadge !== undefined && (
              <span className="text-[10px] bg-slate-200 text-slate-600 py-0.5 px-1.5 rounded-full font-semibold shrink-0">
                {countBadge}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right Controls: Move Up/Down, Visibility, Delete, Chevron */}
      <div className="flex items-center gap-1 shrink-0 mt-2 sm:mt-0">
        {/* Up Button */}
        <button
          type="button"
          onClick={handleMoveUp}
          disabled={index === 0}
          className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 disabled:opacity-30 disabled:hover:bg-white transition-colors cursor-pointer disabled:cursor-not-allowed"
          title="উপরে তুলুন (Move Up)"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>

        {/* Down Button */}
        <button
          type="button"
          onClick={handleMoveDown}
          disabled={index === totalSections - 1}
          className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 disabled:opacity-30 disabled:hover:bg-white transition-colors cursor-pointer disabled:cursor-not-allowed"
          title="নিচে নামান (Move Down)"
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </button>

        {/* Visibility Toggle */}
        <button
          type="button"
          onClick={handleToggleVisibility}
          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
            isHidden
              ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
              : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
          }`}
          title={isHidden ? 'সিভিতে দেখান (Show in CV)' : 'সিভিতে লুকান (Hide from CV)'}
        >
          {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>

        {/* Delete (if custom) */}
        {isCustom && onDeleteCustom && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteCustom();
            }}
            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-colors cursor-pointer"
            title="সেকশনটি মুছুন (Delete Custom Section)"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Expand / Collapse Chevron */}
        <button
          type="button"
          onClick={() => toggleSection(secId)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer ml-1"
        >
          {isActive ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

export default function EditorPanel({ data, onUpdate, onClear, onRestore }: EditorPanelProps) {
  // Section collapse state
  const [activeSection, setActiveSection] = useState<string>('personal');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Photo Crop Modal States
  const [isCropModalOpen, setIsCropModalOpen] = useState<boolean>(false);
  const [tempPhotoForCrop, setTempPhotoForCrop] = useState<string>('');

  // Add Custom Section Input
  const [customTitleInput, setCustomTitleInput] = useState<string>('');

  const order = getEffectiveSectionOrder(data);

  // Quick helper to update specific personal fields
  const updatePersonalInfo = (field: keyof CVData['personalInfo'], value: string) => {
    onUpdate({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [field]: value
      }
    });
  };

  // Section toggler
  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? '' : section);
  };

  // --- Photo Upload Handlers ---
  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, JPEG).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const rawBase64 = reader.result as string;
      setTempPhotoForCrop(rawBase64);
      setIsCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const removePhoto = () => {
    onUpdate({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        photo: ''
      }
    });
  };

  // --- Dynamic Work Experience Handlers ---
  const addWorkExperience = () => {
    const newWork: WorkExperience = {
      id: `work-${Date.now()}`,
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    onUpdate({
      ...data,
      workExperience: [...data.workExperience, newWork]
    });
  };

  const updateWorkExperience = (id: string, field: keyof WorkExperience, value: any) => {
    const updated = data.workExperience.map(work => {
      if (work.id === id) {
        const item = { ...work, [field]: value };
        if (field === 'current' && value === true) {
          item.endDate = '';
        }
        return item;
      }
      return work;
    });
    onUpdate({ ...data, workExperience: updated });
  };

  const removeWorkExperience = (id: string) => {
    onUpdate({
      ...data,
      workExperience: data.workExperience.filter(work => work.id !== id)
    });
  };

  // --- Dynamic Education Handlers ---
  const addEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      school: '',
      degree: '',
      location: '',
      cgpa: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    onUpdate({
      ...data,
      education: [...data.education, newEdu]
    });
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    const updated = data.education.map(edu => {
      if (edu.id === id) {
        const item = { ...edu, [field]: value };
        if (field === 'current' && value === true) {
          item.endDate = '';
        }
        return item;
      }
      return edu;
    });
    onUpdate({ ...data, education: updated });
  };

  const removeEducation = (id: string) => {
    onUpdate({
      ...data,
      education: data.education.filter(edu => edu.id !== id)
    });
  };

  // --- Skills Handlers ---
  const [skillInput, setSkillInput] = useState('');
  
  const addSkill = (skillText?: string) => {
    const text = (skillText || skillInput).trim();
    if (!text) return;
    
    if (data.skills.includes(text)) {
      setSkillInput('');
      return;
    }

    onUpdate({
      ...data,
      skills: [...data.skills, text]
    });
    setSkillInput('');
  };

  const removeSkill = (skillToRemove: string) => {
    onUpdate({
      ...data,
      skills: data.skills.filter(s => s !== skillToRemove)
    });
  };

  const recommendedSkills = [
    'JavaScript', 'React', 'TypeScript', 'Node.js', 'Python', 'UI/UX Design', 
    'Project Management', 'Agile / Scrum', 'SQL', 'Git', 'CSS / Tailwind', 
    'Communication', 'Analytical Thinking', 'Problem Solving'
  ];

  // --- Languages Handlers ---
  const addLanguage = () => {
    const newLang: Language = {
      id: `lang-${Date.now()}`,
      name: '',
      level: 'B1'
    };
    onUpdate({
      ...data,
      languages: [...data.languages, newLang]
    });
  };

  const updateLanguage = (id: string, field: keyof Language, value: any) => {
    const updated = data.languages.map(lang => {
      if (lang.id === id) {
        return { ...lang, [field]: value };
      }
      return lang;
    });
    onUpdate({ ...data, languages: updated });
  };

  const removeLanguage = (id: string) => {
    onUpdate({
      ...data,
      languages: data.languages.filter(lang => lang.id !== id)
    });
  };

  // --- References Handlers ---
  const addReference = () => {
    const newRef: Reference = {
      id: `ref-${Date.now()}`,
      name: '',
      title: '',
      organization: '',
      phone: '',
      email: ''
    };
    onUpdate({
      ...data,
      references: [...(data.references || []), newRef]
    });
  };

  const updateReference = (id: string, field: keyof Reference, value: string) => {
    const updated = (data.references || []).map(ref => {
      if (ref.id === id) {
        return { ...ref, [field]: value };
      }
      return ref;
    });
    onUpdate({ ...data, references: updated });
  };

  const removeReference = (id: string) => {
    onUpdate({
      ...data,
      references: (data.references || []).filter(ref => ref.id !== id)
    });
  };

  // --- Add Custom Section ---
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
    setActiveSection(newId);
  };

  // Delete Custom Section
  const handleDeleteCustomSection = (secId: string) => {
    if (!confirm('আপনি কি সত্যিই এই সেকশনটি মুছে ফেলতে চান?')) return;

    const updatedCustoms = (data.customSections || []).filter(c => c.id !== secId);
    const updatedOrder = order.filter(id => id !== secId);
    const updatedHidden = (data.hiddenSections || []).filter(id => id !== secId);

    onUpdate({
      ...data,
      customSections: updatedCustoms,
      sectionOrder: updatedOrder,
      hiddenSections: updatedHidden
    });
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      
      {/* Editor Header / Presets Toolbar */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            CV Information Builder
          </h2>
          <p className="text-xs text-slate-500">
            প্রতিটি সেকশন কার্ডের হেডারেই [↑] [↓] ও টাইটেল ✏️ এডিট করার অপশন যুক্ত করা হয়েছে
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            id="btn-restore-sample"
            onClick={onRestore}
            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-semibold py-1.5 px-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
            title="Restore sample details"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Load Sample
          </button>
          
          <button 
            id="btn-clear-cv"
            onClick={onClear}
            className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold py-1.5 px-3 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
            title="Clear all fields to start fresh"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All
          </button>
        </div>
      </div>

      {/* Editor Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* SECTION: PERSONAL INFORMATION (Fixed Top Profile Section) */}
        <div id="section-personal-info" className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
          <button
            onClick={() => toggleSection('personal')}
            className="w-full flex items-center justify-between p-4 font-bold text-sm text-slate-800 bg-slate-50/70 hover:bg-slate-50 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-2.5">
              <User className="w-4.5 h-4.5 text-indigo-500" />
              <span>Personal Details (ব্যক্তিগত তথ্য ও ছবি)</span>
            </div>
            {activeSection === 'personal' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          <AnimatePresence initial={false}>
            {activeSection === 'personal' && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 border-t border-slate-100 space-y-4">
                  {/* Photo Uploader */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-600">Professional Photo (প্রফেশনাল পাসপোর্ট সাইজ ছবি)</label>
                    
                    {data.personalInfo.photo ? (
                      <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <img 
                          src={data.personalInfo.photo} 
                          alt="CV candidate" 
                          className="w-16 h-16 object-cover rounded-lg border border-slate-300 shadow-xs shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-700">ছবি আপলোড করা হয়েছে</p>
                          <div className="flex flex-wrap items-center gap-2 pt-0.5">
                            <button 
                              type="button" 
                              onClick={() => {
                                setTempPhotoForCrop(data.personalInfo.photo || '');
                                setIsCropModalOpen(true);
                              }}
                              className="text-xs text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                              title="মাথা বা ছবির পজিশন ঠিক করতে ক্রপ করুন"
                            >
                              <Crop className="w-3.5 h-3.5 text-indigo-600" /> 
                              <span>পজিশন/ক্রপ ঠিক করুন</span>
                            </button>

                            <button 
                              type="button" 
                              onClick={() => fileInputRef.current?.click()}
                              className="text-xs text-slate-600 hover:text-slate-800 bg-white border border-slate-200 font-semibold px-2 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Upload className="w-3 h-3 text-slate-400" />
                              <span>পরিবর্তন</span>
                            </button>

                            <button 
                              type="button" 
                              onClick={removePhoto}
                              className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              রিমুভ
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                          dragActive ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300 bg-slate-50/30'
                        }`}
                      >
                        <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                        <p className="text-xs font-medium text-slate-700">Click to upload or drag & drop</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG or JPEG (Cropping available after upload)</p>
                      </div>
                    )}

                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                      className="hidden" 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name *</label>
                      <input 
                        type="text" 
                        value={data.personalInfo.fullName}
                        onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full text-xs text-slate-700 border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Job Title / Target Role *</label>
                      <input 
                        type="text" 
                        value={data.personalInfo.jobTitle}
                        onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
                        placeholder="e.g. Senior Frontend Engineer"
                        className="w-full text-xs text-slate-700 border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address *</label>
                      <input 
                        type="email" 
                        value={data.personalInfo.email}
                        onChange={(e) => updatePersonalInfo('email', e.target.value)}
                        placeholder="john.doe@example.com"
                        className="w-full text-xs text-slate-700 border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number *</label>
                      <input 
                        type="text" 
                        value={data.personalInfo.phone}
                        onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                        placeholder="+33 6 12 34 56 78"
                        className="w-full text-xs text-slate-700 border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Address / Location</label>
                      <input 
                        type="text" 
                        value={data.personalInfo.address}
                        onChange={(e) => updatePersonalInfo('address', e.target.value)}
                        placeholder="Paris, France"
                        className="w-full text-xs text-slate-700 border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">LinkedIn URL</label>
                      <input 
                        type="text" 
                        value={data.personalInfo.linkedin || ''}
                        onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                        placeholder="linkedin.com/in/johndoe"
                        className="w-full text-xs text-slate-700 border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Website / Portfolio</label>
                      <input 
                        type="text" 
                        value={data.personalInfo.website || ''}
                        onChange={(e) => updatePersonalInfo('website', e.target.value)}
                        placeholder="johndoe.dev"
                        className="w-full text-xs text-slate-700 border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* DYNAMIC SECTIONS LIST IN REORDERED SEQUENCE */}
        {order.map((secId, index) => {

          // 1. SUMMARY
          if (secId === 'summary') {
            return (
              <div key="summary" id="section-summary" className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <SectionCardHeader
                  secId="summary"
                  defaultTitle="Personal Summary / Profile"
                  icon={<FileText className="w-4 h-4 text-indigo-500" />}
                  data={data}
                  onUpdate={onUpdate}
                  activeSection={activeSection}
                  toggleSection={toggleSection}
                  index={index}
                  totalSections={order.length}
                />

                <AnimatePresence initial={false}>
                  {activeSection === 'summary' && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 border-t border-slate-100 space-y-3">
                        <TextFormattingToolbar
                          label="Professional Summary (সারসংক্ষেপ ও পরিচিতি)"
                          hint="ডানে ও বামে মার্জিন সোজা রাখতে Justify টগল অন রাখুন"
                          value={data.personalInfo.summary || ''}
                          onChangeValue={(val) => updatePersonalInfo('summary', val)}
                          textAlign={data.metadata.textAlign || 'justify'}
                          onChangeTextAlign={(align) => onUpdate({ ...data, metadata: { ...data.metadata, textAlign: align } })}
                        />
                        <textarea 
                          value={data.personalInfo.summary || ''}
                          onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                          rows={4}
                          placeholder="Describe your professional profile, key strengths, and what you bring to the table..."
                          className="w-full text-xs text-slate-700 border border-slate-200 rounded-lg p-3 focus:outline-hidden focus:border-indigo-500 transition-colors"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          // 2. WORK EXPERIENCE
          if (secId === 'workExperience') {
            return (
              <div key="workExperience" id="section-work-experience" className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <SectionCardHeader
                  secId="workExperience"
                  defaultTitle="Work Experience"
                  icon={<Briefcase className="w-4 h-4 text-emerald-500" />}
                  data={data}
                  onUpdate={onUpdate}
                  activeSection={activeSection}
                  toggleSection={toggleSection}
                  index={index}
                  totalSections={order.length}
                  countBadge={data.workExperience.length}
                />

                <AnimatePresence initial={false}>
                  {activeSection === 'workExperience' && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 border-t border-slate-100 space-y-4">
                        {data.workExperience.length === 0 && (
                          <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/30">
                            <AlertCircle className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                            <p className="text-xs font-medium text-slate-500">No work experience added yet.</p>
                            <button 
                              type="button"
                              onClick={addWorkExperience}
                              className="mt-2 inline-flex items-center gap-1 text-xs text-indigo-600 font-bold hover:underline cursor-pointer"
                            >
                              Add your first position
                            </button>
                          </div>
                        )}

                        <div className="space-y-4">
                          {data.workExperience.map((exp, expIdx) => (
                            <div key={exp.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50/30 relative space-y-3">
                              <button
                                type="button"
                                onClick={() => removeWorkExperience(exp.id)}
                                className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                                title="Remove experience"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                                Position #{expIdx + 1}
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Job Title / Position</label>
                                  <input 
                                    type="text" 
                                    value={exp.position}
                                    onChange={(e) => updateWorkExperience(exp.id, 'position', e.target.value)}
                                    placeholder="e.g. Senior Software Developer"
                                    className="w-full text-xs text-slate-700 border border-slate-200 bg-white rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-indigo-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Company</label>
                                  <input 
                                    type="text" 
                                    value={exp.company}
                                    onChange={(e) => updateWorkExperience(exp.id, 'company', e.target.value)}
                                    placeholder="e.g. Google France"
                                    className="w-full text-xs text-slate-700 border border-slate-200 bg-white rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-indigo-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Location</label>
                                  <input 
                                    type="text" 
                                    value={exp.location || ''}
                                    onChange={(e) => updateWorkExperience(exp.id, 'location', e.target.value)}
                                    placeholder="e.g. Paris, France"
                                    className="w-full text-xs text-slate-700 border border-slate-200 bg-white rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-indigo-500"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Start Date</label>
                                    <input 
                                      type="month" 
                                      value={exp.startDate}
                                      onChange={(e) => updateWorkExperience(exp.id, 'startDate', e.target.value)}
                                      className="w-full text-xs text-slate-700 border border-slate-200 bg-white rounded-lg px-2 py-1.5 focus:outline-hidden focus:border-indigo-500"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">End Date</label>
                                    <input 
                                      type="month" 
                                      value={exp.endDate}
                                      disabled={exp.current}
                                      onChange={(e) => updateWorkExperience(exp.id, 'endDate', e.target.value)}
                                      className={`w-full text-xs text-slate-700 border border-slate-200 bg-white rounded-lg px-2 py-1.5 focus:outline-hidden focus:border-indigo-500 ${exp.current ? 'opacity-40 cursor-not-allowed' : ''}`}
                                    />
                                  </div>
                                </div>

                                <div className="sm:col-span-2 flex items-center gap-1.5">
                                  <input 
                                    type="checkbox" 
                                    id={`current-${exp.id}`}
                                    checked={exp.current}
                                    onChange={(e) => updateWorkExperience(exp.id, 'current', e.target.checked)}
                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
                                  />
                                  <label htmlFor={`current-${exp.id}`} className="text-xs font-semibold text-slate-600 select-none cursor-pointer">
                                    I currently work in this role
                                  </label>
                                </div>

                                <div className="sm:col-span-2">
                                  <TextFormattingToolbar
                                    label="Duties & Achievements (কাজের বিবরণ ও দায়িত্ব)"
                                    hint="বুলেট যোগ করতে [বুলেট যোগ করুন] চাপুন"
                                    value={exp.description}
                                    onChangeValue={(val) => updateWorkExperience(exp.id, 'description', val)}
                                    textAlign={data.metadata.textAlign || 'justify'}
                                    onChangeTextAlign={(align) => onUpdate({ ...data, metadata: { ...data.metadata, textAlign: align } })}
                                  />
                                  <textarea 
                                    rows={3}
                                    value={exp.description}
                                    onChange={(e) => updateWorkExperience(exp.id, 'description', e.target.value)}
                                    placeholder="• Led cross-functional team of 6 engineers...&#10;• Reduced latency by 40%..."
                                    className="w-full text-xs text-slate-700 border border-slate-200 bg-white rounded-lg p-2.5 focus:outline-hidden focus:border-indigo-500"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={addWorkExperience}
                          className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-4 h-4 text-indigo-600" />
                          <span>Add Another Experience</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          // 3. EDUCATION
          if (secId === 'education') {
            return (
              <div key="education" id="section-education" className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <SectionCardHeader
                  secId="education"
                  defaultTitle="Education & Academic"
                  icon={<GraduationCap className="w-4 h-4 text-blue-500" />}
                  data={data}
                  onUpdate={onUpdate}
                  activeSection={activeSection}
                  toggleSection={toggleSection}
                  index={index}
                  totalSections={order.length}
                  countBadge={data.education.length}
                />

                <AnimatePresence initial={false}>
                  {activeSection === 'education' && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 border-t border-slate-100 space-y-4">
                        {data.education.length === 0 && (
                          <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/30">
                            <AlertCircle className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                            <p className="text-xs font-medium text-slate-500">No education entries added yet.</p>
                            <button 
                              type="button"
                              onClick={addEducation}
                              className="mt-2 inline-flex items-center gap-1 text-xs text-indigo-600 font-bold hover:underline cursor-pointer"
                            >
                              Add your degree
                            </button>
                          </div>
                        )}

                        <div className="space-y-4">
                          {data.education.map((edu, eduIdx) => (
                            <div key={edu.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50/30 relative space-y-3">
                              <button
                                type="button"
                                onClick={() => removeEducation(edu.id)}
                                className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                                title="Remove education"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                                Degree #{eduIdx + 1}
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Degree / Qualification</label>
                                  <input 
                                    type="text" 
                                    value={edu.degree}
                                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                    placeholder="e.g. Master in Computer Science"
                                    className="w-full text-xs text-slate-700 border border-slate-200 bg-white rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-indigo-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Institution / School</label>
                                  <input 
                                    type="text" 
                                    value={edu.school}
                                    onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                                    placeholder="e.g. Sorbonne University"
                                    className="w-full text-xs text-slate-700 border border-slate-200 bg-white rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-indigo-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Location</label>
                                  <input 
                                    type="text" 
                                    value={edu.location || ''}
                                    onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                                    placeholder="e.g. Paris, France"
                                    className="w-full text-xs text-slate-700 border border-slate-200 bg-white rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-indigo-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">CGPA / Result Point (পয়েন্ট)</label>
                                  <input 
                                    type="text" 
                                    value={edu.cgpa || ''}
                                    onChange={(e) => updateEducation(edu.id, 'cgpa', e.target.value)}
                                    placeholder="e.g. 3.80 or 3.85/4.00"
                                    className="w-full text-xs text-slate-700 border border-slate-200 bg-white rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-indigo-500"
                                  />
                                </div>

                                <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <div className="flex justify-between items-center mb-0.5">
                                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Start Date / Year (শুরু)</label>
                                      <span className="text-[9px] text-slate-400">যেমন: 2018 বা Sep 2018</span>
                                    </div>
                                    <input 
                                      type="text" 
                                      value={edu.startDate}
                                      onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                                      placeholder="e.g. 2018 or Sep 2018"
                                      className="w-full text-xs text-slate-700 border border-slate-200 bg-white rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-indigo-500"
                                    />
                                  </div>

                                  <div>
                                    <div className="flex justify-between items-center mb-0.5">
                                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">End / Passing Year (শেষ/পাস)</label>
                                      <span className="text-[9px] text-slate-400">যেমন: 2022 বা Jun 2022</span>
                                    </div>
                                    <input 
                                      type="text" 
                                      value={edu.endDate}
                                      disabled={edu.current}
                                      onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                                      placeholder="e.g. 2022 or Jun 2022"
                                      className={`w-full text-xs text-slate-700 border border-slate-200 bg-white rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-indigo-500 ${edu.current ? 'opacity-40 cursor-not-allowed' : ''}`}
                                    />
                                  </div>
                                </div>

                                <div className="sm:col-span-2 flex items-center gap-1.5">
                                  <input 
                                    type="checkbox" 
                                    id={`edu-current-${edu.id}`}
                                    checked={edu.current}
                                    onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
                                  />
                                  <label htmlFor={`edu-current-${edu.id}`} className="text-xs font-semibold text-slate-600 select-none cursor-pointer">
                                    I am currently studying here
                                  </label>
                                </div>

                                <div className="sm:col-span-2">
                                  <TextFormattingToolbar
                                    label="Honors / Key Courses / Highlights (শিক্ষা অর্জনের বিস্তারিত)"
                                    value={edu.description || ''}
                                    onChangeValue={(val) => updateEducation(edu.id, 'description', val)}
                                    textAlign={data.metadata.textAlign || 'justify'}
                                    onChangeTextAlign={(align) => onUpdate({ ...data, metadata: { ...data.metadata, textAlign: align } })}
                                  />
                                  <textarea 
                                    rows={2}
                                    value={edu.description || ''}
                                    onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                                    placeholder="e.g. Graduated with First Class Honors, Thesis on Distributed AI Systems"
                                    className="w-full text-xs text-slate-700 border border-slate-200 bg-white rounded-lg p-2.5 focus:outline-hidden focus:border-indigo-500"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={addEducation}
                          className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-4 h-4 text-indigo-600" />
                          <span>Add Another Education</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          // 4. SKILLS
          if (secId === 'skills') {
            return (
              <div key="skills" id="section-skills" className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <SectionCardHeader
                  secId="skills"
                  defaultTitle="Skills & Expertise"
                  icon={<Wrench className="w-4 h-4 text-purple-500" />}
                  data={data}
                  onUpdate={onUpdate}
                  activeSection={activeSection}
                  toggleSection={toggleSection}
                  index={index}
                  totalSections={order.length}
                  countBadge={data.skills.length}
                />

                <AnimatePresence initial={false}>
                  {activeSection === 'skills' && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 border-t border-slate-100 space-y-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-slate-600">Add Key Skill</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={skillInput}
                              onChange={(e) => setSkillInput(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                              placeholder="e.g. React, Node.js, Project Management"
                              className="flex-1 text-xs text-slate-700 border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:border-indigo-500"
                            />
                            <button
                              type="button"
                              onClick={() => addSkill()}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
                            >
                              Add
                            </button>
                          </div>
                        </div>

                        {data.skills.length > 0 && (
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Added Skills</label>
                            <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
                              {data.skills.map((skill, sIdx) => (
                                <span 
                                  key={sIdx}
                                  className="inline-flex items-center gap-1 text-xs bg-white text-slate-700 border border-slate-200 font-semibold px-2.5 py-1 rounded-lg shadow-2xs"
                                >
                                  {skill}
                                  <button
                                    type="button"
                                    onClick={() => removeSkill(skill)}
                                    className="text-slate-400 hover:text-rose-500 cursor-pointer ml-0.5"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="space-y-1.5 pt-1">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Suggestions</label>
                          <div className="flex flex-wrap gap-1.5">
                            {recommendedSkills.map((rec, rIdx) => {
                              const isAdded = data.skills.includes(rec);
                              return (
                                <button
                                  key={rIdx}
                                  type="button"
                                  disabled={isAdded}
                                  onClick={() => addSkill(rec)}
                                  className={`text-[11px] font-medium px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
                                    isAdded 
                                      ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed' 
                                      : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                                  }`}
                                >
                                  + {rec}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          // 5. LANGUAGES
          if (secId === 'languages') {
            return (
              <div key="languages" id="section-languages" className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <SectionCardHeader
                  secId="languages"
                  defaultTitle="Languages"
                  icon={<Languages className="w-4 h-4 text-amber-500" />}
                  data={data}
                  onUpdate={onUpdate}
                  activeSection={activeSection}
                  toggleSection={toggleSection}
                  index={index}
                  totalSections={order.length}
                  countBadge={data.languages.length}
                />

                <AnimatePresence initial={false}>
                  {activeSection === 'languages' && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 border-t border-slate-100 space-y-4">
                        <div className="space-y-3">
                          {data.languages.map((lang, lIdx) => (
                            <div key={lang.id} className="p-3 bg-slate-50/50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                              <div className="flex-1 min-w-[140px]">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Language #{lIdx + 1}</label>
                                <input 
                                  type="text" 
                                  value={lang.name}
                                  onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                                  placeholder="e.g. English, French, Bengali"
                                  className="w-full text-xs text-slate-700 border border-slate-200 bg-white rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-indigo-500"
                                />
                              </div>

                              <div className="w-44">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">CEFR Proficiency Level</label>
                                <select
                                  value={lang.level}
                                  onChange={(e) => updateLanguage(lang.id, 'level', e.target.value)}
                                  className="w-full text-xs text-slate-700 border border-slate-200 bg-white rounded-lg px-2 py-1.5 focus:outline-hidden focus:border-indigo-500 font-semibold"
                                >
                                  {CEFR_LEVELS.map(item => (
                                    <option key={item.level} value={item.level}>
                                      {item.label}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeLanguage(lang.id)}
                                className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer self-end mb-0.5"
                                title="Remove language"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={addLanguage}
                          className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-4 h-4 text-amber-500" />
                          <span>Add Language</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          // 6. LEADERSHIP & VOLUNTEERING
          if (secId === 'leadership') {
            const leadershipItems = data.leadership || [];
            return (
              <div key="leadership" id="section-leadership" className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <SectionCardHeader
                  secId="leadership"
                  defaultTitle="Leadership & Volunteering"
                  icon={<Users className="w-4 h-4 text-orange-500" />}
                  data={data}
                  onUpdate={onUpdate}
                  activeSection={activeSection}
                  toggleSection={toggleSection}
                  index={index}
                  totalSections={order.length}
                  countBadge={leadershipItems.length}
                />

                <AnimatePresence initial={false}>
                  {activeSection === 'leadership' && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 border-t border-slate-100 space-y-4">
                        {leadershipItems.length === 0 && (
                          <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/30">
                            <AlertCircle className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                            <p className="text-xs font-medium text-slate-500">No leadership/volunteering added yet.</p>
                            <button 
                              type="button"
                              onClick={() => {
                                const newLead: WorkExperience = {
                                  id: `lead-${Date.now()}`,
                                  company: '',
                                  position: '',
                                  location: '',
                                  startDate: '',
                                  endDate: '',
                                  current: false,
                                  description: ''
                                };
                                onUpdate({ ...data, leadership: [...leadershipItems, newLead] });
                              }}
                              className="mt-2 inline-flex items-center gap-1 text-xs text-orange-600 font-bold hover:underline cursor-pointer"
                            >
                              Add leadership position
                            </button>
                          </div>
                        )}

                        <div className="space-y-4">
                          {leadershipItems.map((lead, lIdx) => (
                            <div key={lead.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50/30 relative space-y-3">
                              <button
                                type="button"
                                onClick={() => {
                                  onUpdate({
                                    ...data,
                                    leadership: leadershipItems.filter(l => l.id !== lead.id)
                                  });
                                }}
                                className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Role Title</label>
                                  <input 
                                    type="text" 
                                    value={lead.position}
                                    onChange={(e) => {
                                      const updated = leadershipItems.map(l => l.id === lead.id ? { ...l, position: e.target.value } : l);
                                      onUpdate({ ...data, leadership: updated });
                                    }}
                                    placeholder="e.g. Club President / Volunteer Lead"
                                    className="w-full text-xs text-slate-700 border border-slate-200 bg-white rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-indigo-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Organization</label>
                                  <input 
                                    type="text" 
                                    value={lead.company}
                                    onChange={(e) => {
                                      const updated = leadershipItems.map(l => l.id === lead.id ? { ...l, company: e.target.value } : l);
                                      onUpdate({ ...data, leadership: updated });
                                    }}
                                    placeholder="e.g. Red Cross / University Tech Club"
                                    className="w-full text-xs text-slate-700 border border-slate-200 bg-white rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-indigo-500"
                                  />
                                </div>

                                <div className="sm:col-span-2">
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Impact / Key Activities</label>
                                  <textarea 
                                    rows={2}
                                    value={lead.description || ''}
                                    onChange={(e) => {
                                      const updated = leadershipItems.map(l => l.id === lead.id ? { ...l, description: e.target.value } : l);
                                      onUpdate({ ...data, leadership: updated });
                                    }}
                                    placeholder="e.g. Organized national hackathon with 500+ attendees..."
                                    className="w-full text-xs text-slate-700 border border-slate-200 bg-white rounded-lg p-2.5 focus:outline-hidden focus:border-indigo-500"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const newLead: WorkExperience = {
                              id: `lead-${Date.now()}`,
                              company: '',
                              position: '',
                              location: '',
                              startDate: '',
                              endDate: '',
                              current: false,
                              description: ''
                            };
                            onUpdate({ ...data, leadership: [...leadershipItems, newLead] });
                          }}
                          className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-4 h-4 text-orange-500" />
                          <span>Add Leadership Role</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          // 7. ACHIEVEMENTS & AWARDS
          if (secId === 'achievements') {
            const achievements = data.achievements || [];
            return (
              <div key="achievements" id="section-achievements" className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <SectionCardHeader
                  secId="achievements"
                  defaultTitle="Achievements & Awards"
                  icon={<Award className="w-4 h-4 text-rose-500" />}
                  data={data}
                  onUpdate={onUpdate}
                  activeSection={activeSection}
                  toggleSection={toggleSection}
                  index={index}
                  totalSections={order.length}
                  countBadge={achievements.length}
                />

                <AnimatePresence initial={false}>
                  {activeSection === 'achievements' && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 border-t border-slate-100 space-y-4">
                        <div className="space-y-3">
                          {achievements.map((ach) => (
                            <div key={ach.id} className="p-3 bg-slate-50/50 rounded-xl border border-slate-200 space-y-2 relative">
                              <button
                                type="button"
                                onClick={() => {
                                  onUpdate({
                                    ...data,
                                    achievements: achievements.filter(a => a.id !== ach.id)
                                  });
                                }}
                                className="absolute top-2.5 right-2.5 text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Award / Honor Title</label>
                                <input 
                                  type="text" 
                                  value={ach.title}
                                  onChange={(e) => {
                                    const updated = achievements.map(a => a.id === ach.id ? { ...a, title: e.target.value } : a);
                                    onUpdate({ ...data, achievements: updated });
                                  }}
                                  placeholder="e.g. Employee of the Year 2023 / National Math Olympiad Winner"
                                  className="w-full text-xs text-slate-700 border border-slate-200 bg-white rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-indigo-500"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Brief Description (Optional)</label>
                                <input 
                                  type="text" 
                                  value={ach.description || ''}
                                  onChange={(e) => {
                                    const updated = achievements.map(a => a.id === ach.id ? { ...a, description: e.target.value } : a);
                                    onUpdate({ ...data, achievements: updated });
                                  }}
                                  placeholder="e.g. Awarded among 1,000+ nominees for exceptional contribution"
                                  className="w-full text-xs text-slate-700 border border-slate-200 bg-white rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-indigo-500"
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const newAch = { id: `ach-${Date.now()}`, title: '', description: '' };
                            onUpdate({ ...data, achievements: [...achievements, newAch] });
                          }}
                          className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-4 h-4 text-rose-500" />
                          <span>Add Achievement / Award</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          // 8. REFERENCES
          if (secId === 'references') {
            const references = data.references || [];
            return (
              <div key="references" id="section-references" className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <SectionCardHeader
                  secId="references"
                  defaultTitle="References"
                  icon={<BookOpen className="w-4 h-4 text-teal-500" />}
                  data={data}
                  onUpdate={onUpdate}
                  activeSection={activeSection}
                  toggleSection={toggleSection}
                  index={index}
                  totalSections={order.length}
                  countBadge={references.length}
                />

                <AnimatePresence initial={false}>
                  {activeSection === 'references' && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 border-t border-slate-100 space-y-4">
                        <div className="space-y-4">
                          {references.map((ref, rIdx) => (
                            <div key={ref.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50/30 relative space-y-3">
                              <button
                                type="button"
                                onClick={() => removeReference(ref.id)}
                                className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                                Reference #{rIdx + 1}
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Full Name</label>
                                  <input 
                                    type="text" 
                                    value={ref.name}
                                    onChange={(e) => updateReference(ref.id, 'name', e.target.value)}
                                    placeholder="e.g. Dr. Marc Dupont"
                                    className="w-full text-xs text-slate-700 border border-slate-200 bg-white rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-indigo-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Job Title / Designation</label>
                                  <input 
                                    type="text" 
                                    value={ref.title}
                                    onChange={(e) => updateReference(ref.id, 'title', e.target.value)}
                                    placeholder="e.g. Engineering VP"
                                    className="w-full text-xs text-slate-700 border border-slate-200 bg-white rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-indigo-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Organization / Company</label>
                                  <input 
                                    type="text" 
                                    value={ref.organization || ''}
                                    onChange={(e) => updateReference(ref.id, 'organization', e.target.value)}
                                    placeholder="e.g. TechCorp France"
                                    className="w-full text-xs text-slate-700 border border-slate-200 bg-white rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-indigo-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Phone Number</label>
                                  <input 
                                    type="text" 
                                    value={ref.phone || ''}
                                    onChange={(e) => updateReference(ref.id, 'phone', e.target.value)}
                                    placeholder="+33 1 23 45 67 89"
                                    className="w-full text-xs text-slate-700 border border-slate-200 bg-white rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-indigo-500"
                                  />
                                </div>

                                <div className="sm:col-span-2">
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Email Address</label>
                                  <input 
                                    type="email" 
                                    value={ref.email || ''}
                                    onChange={(e) => updateReference(ref.id, 'email', e.target.value)}
                                    placeholder="m.dupont@techcorp.fr"
                                    className="w-full text-xs text-slate-700 border border-slate-200 bg-white rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-indigo-500"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={addReference}
                          className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-4 h-4 text-teal-600" />
                          <span>Add Reference</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          // 9. CUSTOM SECTIONS
          if (secId.startsWith('custom-')) {
            const custom = (data.customSections || []).find(c => c.id === secId);
            if (!custom) return null;

            return (
              <div key={secId} id={`section-${secId}`} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <SectionCardHeader
                  secId={secId}
                  defaultTitle={custom.title || 'Custom Section'}
                  icon={<Layers className="w-4 h-4 text-amber-600" />}
                  data={data}
                  onUpdate={onUpdate}
                  activeSection={activeSection}
                  toggleSection={toggleSection}
                  index={index}
                  totalSections={order.length}
                  countBadge={custom.items?.length || 0}
                  isCustom={true}
                  onDeleteCustom={() => handleDeleteCustomSection(secId)}
                />

                <AnimatePresence initial={false}>
                  {activeSection === secId && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <CustomSectionEditor
                        section={custom}
                        data={data}
                        onUpdate={onUpdate}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          return null;
        })}

        {/* BOTTOM ADD CUSTOM SECTION BAR */}
        <div className="border-2 border-dashed border-indigo-200 rounded-xl p-4 bg-indigo-50/30 space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 text-white rounded-lg shadow-2xs">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-indigo-900">
                নতুন যেকোনো সেকশন যোগ করুন (Add Custom Section)
              </h3>
              <p className="text-[11px] text-slate-500 font-normal">
                সার্টিফিকেশন, প্রজেক্ট, গবেষণা বা অন্য যেকোনো শিরোনামের সেকশন তৈরি করতে পারেন
              </p>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap gap-1.5">
            {CUSTOM_SECTION_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleAddCustomSection(preset.title.split(' (')[0])}
                className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 text-indigo-800 border border-indigo-200 hover:border-indigo-300 transition-colors cursor-pointer shadow-2xs"
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
              placeholder="অথবা নিজের মতো সেকশন নাম লিখুন (e.g. Certifications, Portfolio)"
              className="flex-1 text-xs border border-slate-200 bg-white rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>যোগ করুন</span>
            </button>
          </div>
        </div>

      </div>

      {/* Photo Crop Modal */}
      {isCropModalOpen && (
        <PhotoCropModal
          isOpen={isCropModalOpen}
          imageSrc={tempPhotoForCrop}
          onClose={() => setIsCropModalOpen(false)}
          onCropComplete={(croppedImageBase64) => {
            onUpdate({
              ...data,
              personalInfo: {
                ...data.personalInfo,
                photo: croppedImageBase64
              }
            });
            setIsCropModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
