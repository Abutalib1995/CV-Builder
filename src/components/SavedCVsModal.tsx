import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, FolderOpen, Plus, Trash2, Edit3, Check, Copy, 
  Clock, FileText, Sparkles, AlertCircle, ArrowRight 
} from 'lucide-react';
import { SavedCVItem, getUserCVs, saveCVVersion, deleteCVVersion } from '../lib/firebase';
import { CVData } from '../types';

interface SavedCVsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  currentCvData: CVData;
  onLoadCV: (cvData: CVData) => void;
}

export default function SavedCVsModal({
  isOpen,
  onClose,
  userId,
  currentCvData,
  onLoadCV
}: SavedCVsModalProps) {
  const [cvList, setCvList] = useState<SavedCVItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [savingNew, setSavingNew] = useState(false);
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
    const { success, error } = await saveCVVersion(userId, newId, newTitle.trim(), currentCvData);
    setSavingNew(false);

    if (success) {
      setNewTitle('');
      setStatusMsg({ type: 'success', text: `"${newTitle}" নতুন ভার্সন হিসেবে সংরক্ষণ করা হয়েছে!` });
      fetchCVs();
    } else {
      setStatusMsg({ type: 'error', text: error || 'সংরক্ষণ করা সম্ভব হয়নি।' });
    }
  };

  const handleOverwrite = async (item: SavedCVItem) => {
    if (!confirm(`আপনি কি "${item.title}" সিভিটি বর্তমান এডিটর ডেটা দিয়ে ওভাররাইট/আপডেট করতে চান?`)) return;
    
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-600 text-white rounded-xl shadow-xs">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                আমার সংরক্ষিত সিভি ভার্সনসমূহ (My Saved CVs)
              </h3>
              <p className="text-[11px] text-slate-500">
                ভিন্ন ভিন্ন চাকুরির জন্য আলাদা আলাদা সিভি ভার্সন সেভ রাখুন
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
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Status Message */}
          {statusMsg && (
            <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-medium ${
              statusMsg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              <span>{statusMsg.text}</span>
              <button onClick={() => setStatusMsg(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Form to Save Current CV as New Version */}
          <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-900">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>বর্তমান সিভি নতুন ভার্সন হিসেবে সংরক্ষণ করুন</span>
            </div>
            <form onSubmit={handleSaveAsNew} className="flex gap-2">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="যেমন: Software Developer CV / Bank Job CV"
                className="flex-1 text-xs border border-purple-200 bg-white rounded-xl px-3 py-2 focus:outline-hidden focus:border-purple-500 text-slate-800"
                required
              />
              <button
                type="submit"
                disabled={savingNew || !newTitle.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>{savingNew ? 'সেভ হচ্ছে...' : 'সেভ করুন'}</span>
              </button>
            </form>
          </div>

          {/* List of Saved CVs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              সংরক্ষিত সিভির তালিকা ({cvList.length})
            </h4>

            {loading ? (
              <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                <span>ক্লাউড থেকে সিভি লোড হচ্ছে...</span>
              </div>
            ) : cvList.length === 0 ? (
              <div className="py-10 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-center space-y-2 p-4">
                <FolderOpen className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-600">কোন সংরক্ষিত সিভি ভার্সন পাওয়া যায়নি</p>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  উপরের বক্সে নাম লিখে (যেমন: "Frontend Developer CV") "সেভ করুন" বাটনে ক্লিক করে প্রথম সিভি ভার্সনটি সেইভ করুন।
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {cvList.map((item) => {
                  const isEditing = editingId === item.id;
                  const templateName = item.data?.metadata?.templateId || 'Classic';

                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-slate-200 hover:border-purple-300 rounded-2xl p-3.5 transition-all shadow-2xs hover:shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
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
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-slate-800 text-sm truncate">{item.title}</h5>
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

                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span className="capitalize font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                            {templateName} Template
                          </span>
                          <span>•</span>
                          <span className="truncate">
                            {item.data?.personalInfo?.fullName || 'No Name'}
                          </span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <button
                          onClick={() => {
                            onLoadCV(item.data);
                            onClose();
                          }}
                          className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-1.5 px-3 rounded-xl transition-all cursor-pointer shadow-xs"
                          title="এই সিভি এডিটরে লোড করুন"
                        >
                          <span>লোড করুন</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleOverwrite(item)}
                          className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                          title="বর্তমান এডিটর ডেটা দিয়ে ওভাররাইট করুন"
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
          <span>💡 বিভিন্ন কোম্পানি বা পদের আবেদন অনুযায়ী সিভি তৈরি করতে ভার্সন ব্যবহার করুন</span>
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
