import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, FolderOpen, Plus, Trash2, Edit3, Check, Copy, 
  FileText, Sparkles, ArrowRight, Search, UserPlus, 
  CheckCircle, User, RefreshCw
} from 'lucide-react';
import { SavedCVItem, getUserCVs, saveCVVersion, deleteCVVersion } from '../lib/firebase';
import { CVData } from '../types';
import { INITIAL_CV_DATA } from '../data';

interface SavedCVsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  currentCvData: CVData;
  currentCvId: string;
  currentCvTitle: string;
  onLoadCV: (id: string, title: string, cvData: CVData) => void;
  onCreateNewCV: (title: string, isBlank: boolean) => void;
}

export default function SavedCVsModal({
  isOpen,
  onClose,
  userId,
  currentCvData,
  currentCvId,
  currentCvTitle,
  onLoadCV,
  onCreateNewCV
}: SavedCVsModalProps) {
  const [cvList, setCvList] = useState<SavedCVItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // States for creating new CV
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [createOption, setCreateOption] = useState<'current' | 'blank' | 'sample'>('current');
  const [savingNew, setSavingNew] = useState(false);
  
  // Renaming state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (isOpen && userId) {
      fetchCVs();
    }
  }, [isOpen, userId]);

  const fetchCVs = async () => {
    setLoading(true);
    const list = await getUserCVs(userId);
    setCvList(list);
    setLoading(false);
  };

  const handleSaveAsNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setSavingNew(true);
    setStatusMsg(null);
    const newId = `cv_${Date.now()}`;

    let dataToSave = currentCvData;
    if (createOption === 'blank') {
      dataToSave = {
        personalInfo: {
          fullName: newTitle.trim(),
          jobTitle: '',
          email: '',
          phone: '',
          address: '',
          summary: '',
          photo: ''
        },
        workExperience: [],
        education: [],
        skills: [],
        languages: [],
        metadata: {
          templateId: 'classic',
          accentColor: '#2563eb',
          fontSize: 100
        }
      };
    } else if (createOption === 'sample') {
      dataToSave = {
        ...INITIAL_CV_DATA,
        personalInfo: {
          ...INITIAL_CV_DATA.personalInfo,
          fullName: newTitle.trim()
        }
      };
    }

    const { success, error } = await saveCVVersion(userId, newId, newTitle.trim(), dataToSave);
    setSavingNew(false);

    if (success) {
      setNewTitle('');
      setShowCreateForm(false);
      setStatusMsg({ type: 'success', text: `"${newTitle}" সিভিটি সফলভাবে তৈরি করা হয়েছে!` });
      await fetchCVs();
      // Load this newly created CV as current active CV
      onLoadCV(newId, newTitle.trim(), dataToSave);
    } else {
      setStatusMsg({ type: 'error', text: error || 'সংরক্ষণ করা সম্ভব হয়নি।' });
    }
  };

  const handleOverwrite = async (item: SavedCVItem) => {
    if (!confirm(`আপনি কি "${item.title}" সিভিটি বর্তমান এডিটর ডেটা দিয়ে আপডেট করতে চান?`)) return;
    
    setStatusMsg(null);
    const { success, error } = await saveCVVersion(userId, item.id, item.title, currentCvData);
    if (success) {
      setStatusMsg({ type: 'success', text: `"${item.title}" সফলভাবে আপডেট করা হয়েছে!` });
      fetchCVs();
    } else {
      setStatusMsg({ type: 'error', text: error || 'আপডেট ব্যর্থ হয়েছে।' });
    }
  };

  const handleRename = async (id: string) => {
    if (!editTitle.trim()) return;
    const target = cvList.find(c => c.id === id);
    if (!target) return;

    const { success } = await saveCVVersion(userId, id, editTitle.trim(), target.data);
    if (success) {
      setEditingId(null);
      fetchCVs();
    }
  };

  const handleDuplicate = async (item: SavedCVItem) => {
    const dupTitle = `${item.title} (অনুলিপি)`;
    const newId = `cv_${Date.now()}`;
    const { success } = await saveCVVersion(userId, newId, dupTitle, item.data);
    if (success) {
      setStatusMsg({ type: 'success', text: `"${dupTitle}" অনুলিপি তৈরি করা হয়েছে!` });
      fetchCVs();
    }
  };

  const handleDelete = async (item: SavedCVItem) => {
    if (!confirm(`আপনি কি নিশ্চিত যে "${item.title}" সিভিটি মুছে ফেলতে চান?`)) return;
    
    const { success } = await deleteCVVersion(userId, item.id);
    if (success) {
      setStatusMsg({ type: 'success', text: `"${item.title}" মুছে ফেলা হয়েছে।` });
      fetchCVs();
    }
  };

  const filteredCVs = cvList.filter(item => {
    const q = searchQuery.toLowerCase();
    const titleMatch = item.title?.toLowerCase().includes(q);
    const nameMatch = item.data?.personalInfo?.fullName?.toLowerCase().includes(q);
    return titleMatch || nameMatch;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-600 text-white rounded-xl shadow-xs">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                সংরক্ষিত সিভিসমূহ (Multiple CV Profiles)
              </h3>
              <p className="text-[11px] text-slate-500">
                নিজের ও অন্যের জন্য একাধিক সিভি বানিয়ে ক্লাউডে সেভ ও ম্যানেজ করুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Status Message */}
          {statusMsg && (
            <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-medium ${
              statusMsg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              <span>{statusMsg.text}</span>
              <button onClick={() => setStatusMsg(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Action Bar: Create New CV Button & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
            >
              {showCreateForm ? <X className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              <span>{showCreateForm ? 'ফর্ম বন্ধ করুন' : '+ নতুন কারো জন্য সিভি তৈরি করুন'}</span>
            </button>

            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="সিভি বা প্রার্থীর নাম লিখে খুঁজুন..."
                className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-purple-500 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Form to Create / Save New CV */}
          <AnimatePresence>
            {showCreateForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSaveAsNew}
                className="bg-purple-50/80 border border-purple-200 rounded-2xl p-4 space-y-3 overflow-hidden"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-purple-900">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>নতুন সিভি প্রোফাইল যোগ করুন</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    সিভি বা প্রার্থীর নাম (CV Title / Candidate Name):
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="যেমন: আনিসুর রহমান (নিজের সিভি) / তানভীর হাসান (Software Eng)"
                    className="w-full text-xs border border-purple-200 bg-white rounded-xl px-3 py-2 focus:outline-hidden focus:border-purple-500 text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    সূচনা করার মাধ্যম (Starting Type):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                      createOption === 'current' ? 'bg-white border-purple-500 text-purple-900 font-bold shadow-2xs' : 'bg-purple-100/50 border-purple-200 text-slate-600'
                    }`}>
                      <input
                        type="radio"
                        name="createOption"
                        checked={createOption === 'current'}
                        onChange={() => setCreateOption('current')}
                        className="text-purple-600"
                      />
                      <span>বর্তমান সিভি কপি করুন</span>
                    </label>

                    <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                      createOption === 'blank' ? 'bg-white border-purple-500 text-purple-900 font-bold shadow-2xs' : 'bg-purple-100/50 border-purple-200 text-slate-600'
                    }`}>
                      <input
                        type="radio"
                        name="createOption"
                        checked={createOption === 'blank'}
                        onChange={() => setCreateOption('blank')}
                        className="text-purple-600"
                      />
                      <span>ফাঁকা ফরম (Blank Fresh)</span>
                    </label>

                    <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                      createOption === 'sample' ? 'bg-white border-purple-500 text-purple-900 font-bold shadow-2xs' : 'bg-purple-100/50 border-purple-200 text-slate-600'
                    }`}>
                      <input
                        type="radio"
                        name="createOption"
                        checked={createOption === 'sample'}
                        onChange={() => setCreateOption('sample')}
                        className="text-purple-600"
                      />
                      <span>স্যাম্পল ফরম (Sample)</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={savingNew || !newTitle.trim()}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{savingNew ? 'তৈরি হচ্ছে...' : 'তৈরি করুন ও লোড করুন'}</span>
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* List of Saved CVs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                সংরক্ষিত সিভি তালিকা ({filteredCVs.length})
              </h4>
              {loading && (
                <div className="flex items-center gap-1 text-[11px] text-purple-600">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>লোড হচ্ছে...</span>
                </div>
              )}
            </div>

            {loading && cvList.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                <span>ক্লাউড থেকে সিভি লোড হচ্ছে...</span>
              </div>
            ) : filteredCVs.length === 0 ? (
              <div className="py-10 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-center space-y-2 p-4">
                <FolderOpen className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-600">
                  {searchQuery ? 'খুঁজে পাওয়া যায়নি' : 'কোন সংরক্ষিত সিভি পাওয়া যায়নি'}
                </p>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  উপরের "+ নতুন কারো জন্য সিভি তৈরি করুন" বাটনে ক্লিক করে প্রথম সিভি প্রোফাইলটি সেভ করুন।
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredCVs.map((item) => {
                  const isActive = currentCvId === item.id;
                  const isEditing = editingId === item.id;
                  const templateName = item.data?.metadata?.templateId || 'Classic';
                  const candidateName = item.data?.personalInfo?.fullName || 'No Name';

                  return (
                    <div
                      key={item.id}
                      className={`border rounded-2xl p-3.5 transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isActive 
                          ? 'bg-purple-50/60 border-purple-300 ring-1 ring-purple-300' 
                          : 'bg-white border-slate-200 hover:border-purple-200'
                      }`}
                    >
                      {/* Left: Info */}
                      <div className="space-y-1 flex-1 min-w-0">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="text-xs border border-purple-300 rounded-lg px-2.5 py-1 focus:outline-hidden text-slate-800 font-bold"
                            />
                            <button
                              onClick={() => handleRename(item.id)}
                              className="p-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1 bg-slate-200 text-slate-600 rounded-md hover:bg-slate-300 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="font-bold text-slate-800 text-sm truncate">{item.title}</h5>
                            {isActive && (
                              <span className="inline-flex items-center gap-1 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                <CheckCircle className="w-3 h-3" />
                                <span>বর্তমানে সক্রিয়</span>
                              </span>
                            )}
                            <button
                              onClick={() => {
                                setEditingId(item.id);
                                setEditTitle(item.title);
                              }}
                              className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                              title="নাম পরিবর্তন করুন"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
                          <span className="flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                            <User className="w-3 h-3 text-slate-500" />
                            {candidateName}
                          </span>
                          <span>•</span>
                          <span className="capitalize font-medium text-slate-500">
                            {templateName} Template
                          </span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        {!isActive && (
                          <button
                            onClick={() => {
                              onLoadCV(item.id, item.title, item.data);
                              onClose();
                            }}
                            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-1.5 px-3 rounded-xl transition-all cursor-pointer shadow-xs"
                            title="এই সিভি এডিটরে লোড করুন"
                          >
                            <span>লোড করুন</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => handleOverwrite(item)}
                          className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                          title="বর্তমান এডিটর ডেটা দিয়ে আপডেট করুন"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDuplicate(item)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="অনুলিপি তৈরি করুন"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center shrink-0">
          <span>💡 নিজের এবং ক্লায়েন্ট/বন্ধুদের জন্য আলাদা প্রোফাইল লিখে দ্রুত সেভ করতে পারেন</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </motion.div>
    </div>
  );
}
