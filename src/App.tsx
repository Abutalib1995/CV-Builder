import React, { useState, useEffect } from 'react';
import { CVData } from './types';
import { INITIAL_CV_DATA } from './data';
import EditorPanel from './components/EditorPanel';
import StyleSwitcher from './components/StyleSwitcher';
import CVTemplate, { getFontScaleNumber, getLineSpacingNumber } from './components/CVTemplates';
import AuthModal from './components/AuthModal';
import SavedCVsModal from './components/SavedCVsModal';
import { 
  Download, Sparkles, FileText, Smartphone, Laptop, 
  HelpCircle, Eye, RefreshCw, Printer, AlertTriangle, CheckCircle, ExternalLink,
  User as UserIcon, LogOut, Cloud, CloudCheck, LogIn, Save, FolderOpen, UserPlus
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'motion/react';
import { 
  auth, onAuthStateChanged, logoutUser, saveCVToCloud, loadCVFromCloud, 
  saveCVVersion, getUserCVs, User 
} from './lib/firebase';

export default function App() {
  // Main CV State initialized from localStorage (if exists) or the premium sample data
  const [cvData, setCvData] = useState<CVData>(() => {
    try {
      const saved = localStorage.getItem('cv_builder_data');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load saved CV data from localStorage:', e);
    }
    return INITIAL_CV_DATA;
  });

  // Track active CV profile document ID and Title
  const [currentCvId, setCurrentCvId] = useState<string>(() => {
    return localStorage.getItem('cv_builder_current_id') || 'current_cv';
  });
  const [currentCvTitle, setCurrentCvTitle] = useState<string>(() => {
    return localStorage.getItem('cv_builder_current_title') || 'আমার সিভি';
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [previewScale, setPreviewScale] = useState<number>(100);
  const [isInsideIframe, setIsInsideIframe] = useState(false);

  // Firebase Auth & Cloud Sync States
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSavedCVsModalOpen, setIsSavedCVsModalOpen] = useState(false);
  const [cloudStatus, setCloudStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSavedTime, setLastSavedTime] = useState<string>('');

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Automatically load existing CVs from cloud on initial login
        const userCvs = await getUserCVs(currentUser.uid);
        if (userCvs.length > 0) {
          setCurrentCvId(userCvs[0].id);
          setCurrentCvTitle(userCvs[0].title);
          setCvData(userCvs[0].data);
          setCloudStatus('saved');
        } else {
          const cloudCV = await loadCVFromCloud(currentUser.uid);
          if (cloudCV) {
            setCvData(cloudCV);
            setCloudStatus('saved');
          }
        }
      } else {
        setCloudStatus('idle');
      }
    });
    return () => unsubscribe();
  }, []);

  // Automatically save CV data to localStorage & Cloud whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cv_builder_data', JSON.stringify(cvData));
      localStorage.setItem('cv_builder_current_id', currentCvId);
      localStorage.setItem('cv_builder_current_title', currentCvTitle);
      const now = new Date();
      setLastSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (e) {
      console.error('Failed to save CV data to localStorage:', e);
    }

    // Auto sync to cloud if user is logged in
    if (user) {
      setCloudStatus('saving');
      const timer = setTimeout(async () => {
        const { success } = await saveCVVersion(user.uid, currentCvId, currentCvTitle, cvData);
        if (success) {
          setCloudStatus('saved');
        } else {
          setCloudStatus('error');
        }
      }, 1000); // 1 sec debounce
      return () => clearTimeout(timer);
    }
  }, [cvData, user, currentCvId, currentCvTitle]);

  // Periodic 2-minute background auto-save timer
  useEffect(() => {
    const twoMinuteInterval = setInterval(() => {
      try {
        localStorage.setItem('cv_builder_data', JSON.stringify(cvData));
        if (user) {
          saveCVVersion(user.uid, currentCvId, currentCvTitle, cvData);
        }
        const now = new Date();
        setLastSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } catch (e) {
        console.error('Periodic 2-minute auto-save error:', e);
      }
    }, 120000); // Every 2 minutes (120,000 ms)

    return () => clearInterval(twoMinuteInterval);
  }, [cvData, user, currentCvId, currentCvTitle]);

  const handleManualCloudSave = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setCloudStatus('saving');
    const { success, error } = await saveCVVersion(user.uid, currentCvId, currentCvTitle, cvData);
    if (success) {
      setCloudStatus('saved');
      alert(`"${currentCvTitle}" সিভিটি সফলভাবে Firebase NoSQL Database (Cloud)-এ সেইভ করা হয়েছে!`);
    } else {
      setCloudStatus('error');
      alert(error || "ক্লাউড সেইভ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    }
  };

  const handleLoadCV = (id: string, title: string, loadedData: CVData) => {
    setCurrentCvId(id);
    setCurrentCvTitle(title);
    setCvData(loadedData);
    setCloudStatus('saved');
  };

  useEffect(() => {
    try {
      const inside = window.self !== window.top;
      setIsInsideIframe(inside);
      if (inside) {
        setPreviewScale(75);
      }
    } catch (e) {
      setIsInsideIframe(true);
      setPreviewScale(75);
    }
  }, []);

  // Sync state update
  const handleUpdate = (updated: CVData) => {
    setCvData(updated);
  };

  // Switch template or colors
  const handleMetadataChange = (updatedMetadata: CVData['metadata']) => {
    setCvData({
      ...cvData,
      metadata: updatedMetadata
    });
  };

  // Clear CV data fields with user confirmation
  const handleClear = () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear all details? This will erase your current input fields so you can start fresh."
    );
    if (confirmClear) {
      setCvData({
        personalInfo: {
          fullName: '',
          jobTitle: '',
          email: '',
          phone: '',
          address: '',
          website: '',
          linkedin: '',
          summary: '',
          photo: '',
        },
        workExperience: [],
        education: [],
        skills: [],
        languages: [],
        metadata: {
          templateId: cvData.metadata.templateId, // preserve current template select
          accentColor: cvData.metadata.accentColor, // preserve current color selection
          fontSize: 100
        }
      });
    }
  };

  // Restore beautiful sample dataset
  const handleRestore = () => {
    const confirmRestore = window.confirm(
      "Would you like to restore the default sample CV? This will overwrite your current progress."
    );
    if (confirmRestore) {
      setCvData(INITIAL_CV_DATA);
    }
  };

  // Native window / iframe print for 100% vector, editable/selectable perfect PDF
  const handlePrint = () => {
    const previewElement = document.getElementById('cv-preview-sheet');
    if (!previewElement) {
      alert("সিভি প্রিভিউ পাওয়া যায়নি। দয়া করে পেজটি রিফ্রেশ করে আবার চেষ্টা করুন।");
      return;
    }

    try {
      // Create or reuse dedicated print iframe for isolated A4 printing
      let printFrame = document.getElementById('cv-print-frame') as HTMLIFrameElement | null;
      if (printFrame && printFrame.parentNode) {
        printFrame.parentNode.removeChild(printFrame);
      }

      printFrame = document.createElement('iframe');
      printFrame.id = 'cv-print-frame';
      printFrame.style.position = 'fixed';
      printFrame.style.right = '0';
      printFrame.style.bottom = '0';
      printFrame.style.width = '0';
      printFrame.style.height = '0';
      printFrame.style.border = '0';
      printFrame.style.visibility = 'hidden';
      document.body.appendChild(printFrame);

      const frameDoc = printFrame.contentWindow?.document;
      if (!frameDoc) {
        window.print();
        return;
      }

      // Collect all document stylesheets and font tags
      const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
        .map((style) => style.outerHTML)
        .join('\n');

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${cvData.personalInfo.fullName || 'European CV'}</title>
            ${styles}
            <style>
              @page {
                size: A4 portrait;
                margin: 0;
              }
              body {
                margin: 0 !important;
                padding: 0 !important;
                background: #ffffff !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              #cv-preview-sheet {
                width: 210mm !important;
                min-height: 297mm !important;
                margin: 0 auto !important;
                box-shadow: none !important;
                border: none !important;
                zoom: 1 !important;
                transform: none !important;
              }
            </style>
          </head>
          <body>
            <div id="cv-preview-sheet" class="cv-preview-container bg-white">
              ${previewElement.innerHTML}
            </div>
          </body>
        </html>
      `;

      frameDoc.open();
      frameDoc.write(htmlContent);
      frameDoc.close();

      setTimeout(() => {
        try {
          if (printFrame && printFrame.contentWindow) {
            printFrame.contentWindow.focus();
            printFrame.contentWindow.print();
          } else {
            window.print();
          }
        } catch (iframeErr) {
          console.warn("Iframe print blocked, calling standard window.print()", iframeErr);
          try {
            window.print();
          } catch (winErr) {
            console.error("window.print() failed, auto fallback to PDF download", winErr);
            handleDownloadPdf();
          }
        }
      }, 350);
    } catch (e) {
      console.error("Print execution error, falling back to PDF download", e);
      handleDownloadPdf();
    }
  };

  // High-fidelity PDF compilation logic
  const handleDownloadPdf = async () => {
    const previewElement = document.getElementById('cv-preview-sheet');
    if (!previewElement) {
      alert("Could not locate CV preview workspace. Please refresh and try again.");
      return;
    }

    setIsGenerating(true);

    try {
      // Configuration for crisp, pixel-perfect rendering
      const options = {
        scale: 3, // Increased scale to 3 for super high resolution sharpness
        useCORS: true, // Allow external assets like candidate photos
        logging: false,
        backgroundColor: '#ffffff', // Guarantee clean white sheet background
        windowWidth: 794, // Lock element width during print scan (210mm at 96dpi)
        imageTimeout: 15000,
      };

      // Compile canvas using html2canvas
      const canvas = await html2canvas(previewElement, options);
      const imgData = canvas.toDataURL('image/png', 1.0); // Maximum quality PNG
      
      // Initialize A4 PDF (210mm x 297mm)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      // Add image stretching precisely across A4 dimensions
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
      
      // Dynamically name file based on Candidate name
      const candidateName = cvData.personalInfo.fullName.trim() 
        ? cvData.personalInfo.fullName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')
        : 'European';
        
      pdf.save(`${candidateName}-CV.pdf`);
      
      // Visual feedback confirmation
      setShowExportSuccess(true);
      setTimeout(() => setShowExportSuccess(false), 4000);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("An error occurred during PDF compiling. Please check your image format and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* 1. TOP HEADER / BRANDING NAVBAR */}
      <header className="bg-white border-b border-slate-200 py-3 px-6 shrink-0 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          
          {/* Logo and Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <FileText className="w-5.5 h-5.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-800 leading-none">European CV Builder</h1>
                <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 tracking-wider py-0.5 px-2 rounded-full">
                  Real-time PDF
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Design custom professional resumes in standard Europass, Swiss, or Parisian templates.
              </p>
            </div>
          </div>

          {/* Quick Info, Auth & Cloud Sync Details */}
          <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
            
            {/* Auto-Save Status Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold" title="ব্রাউজারে প্রতিটি পরিবর্তন সাথে সাথে এবং প্রতি ২ মিনিটে স্বয়ংক্রিয়ভাবে সংরক্ষিত হয়">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>অটো সেভ সক্রিয় {lastSavedTime ? `(${lastSavedTime})` : ''}</span>
            </div>

            {/* My Saved CVs Button */}
            <button
              type="button"
              onClick={() => {
                if (user) {
                  setIsSavedCVsModalOpen(true);
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title="সংরক্ষিত বিভিন্ন সিভি ভার্সন দেখুন ও পরিবর্তন করুন"
            >
              <FolderOpen className="w-3.5 h-3.5 text-purple-600" />
              <span>আমার সিভিসমূহ</span>
            </button>

            {/* Cloud Status Indicator */}
            {user && (
              <button
                type="button"
                onClick={handleManualCloudSave}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  cloudStatus === 'saving'
                    ? 'bg-amber-50 border-amber-200 text-amber-700 animate-pulse'
                    : cloudStatus === 'saved'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
                title="ক্লাউডে সিভি সংরক্ষণ করুন"
              >
                {cloudStatus === 'saving' ? (
                  <>
                    <Cloud className="w-3.5 h-3.5 animate-spin text-amber-600" />
                    <span>Saving...</span>
                  </>
                ) : cloudStatus === 'saved' ? (
                  <>
                    <CloudCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Cloud Saved</span>
                  </>
                ) : (
                  <>
                    <Cloud className="w-3.5 h-3.5 text-slate-500" />
                    <span>Save to Cloud</span>
                  </>
                )}
              </button>
            )}

            {/* Auth Buttons / Profile Menu */}
            {user ? (
              <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 pl-2 pr-1 py-1 rounded-xl">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="User" className="w-6 h-6 rounded-full object-cover border border-white" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <span className="font-bold text-slate-700 max-w-[110px] truncate text-xs">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
                <button
                  onClick={() => logoutUser()}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer ml-1"
                  title="লগআউট করুন"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>লগইন / সাইন আপ (Login)</span>
              </button>
            )}

            <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 pl-3">
              <span className="font-semibold text-slate-700">Standards compliant</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
          </div>

        </div>
      </header>

      {/* Active CV Profile Info Banner */}
      <div className="max-w-7xl w-full mx-auto px-4 md:px-6 pt-3 pb-0">
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-3 px-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-purple-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-700/80 rounded-xl text-purple-200 shrink-0 shadow-inner">
              <UserIcon className="w-4 h-4 text-purple-100" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-purple-700/80 text-purple-200 px-2 py-0.5 rounded-md border border-purple-600/50">
                  সক্রিয় সিভি (Active)
                </span>
                <span className="text-xs font-bold text-white">{currentCvTitle}</span>
              </div>
              <p className="text-[11px] text-purple-200 mt-0.5">
                প্রার্থীর নাম: <strong className="text-white font-bold">{cvData.personalInfo.fullName || 'নাম দেওয়া হয়নি'}</strong>
                {cvData.personalInfo.jobTitle ? ` • ${cvData.personalInfo.jobTitle}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => {
                if (!user) {
                  setIsAuthModalOpen(true);
                } else {
                  setIsSavedCVsModalOpen(true);
                }
              }}
              className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-1.5 px-3 rounded-xl transition-all cursor-pointer shadow-xs"
              title="অন্য প্রার্থীর বা সংরক্ষিত সিভি খুলুন"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>সিভি নির্বাচন / পরিবর্তন</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (!user) {
                  setIsAuthModalOpen(true);
                } else {
                  setIsSavedCVsModalOpen(true);
                }
              }}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-1.5 px-3 rounded-xl transition-all cursor-pointer shadow-xs"
              title="অন্য কারো জন্য নতুন সিভি শুরু করুন"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ অন্যের জন্য সিভি তৈরি করুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* TOP BAR: Choose CV Layout Style & Theme Customizer */}
      <div className="max-w-7xl w-full mx-auto px-4 md:px-6 pt-3 pb-1">
        <StyleSwitcher 
          metadata={cvData.metadata} 
          onChange={handleMetadataChange} 
        />
      </div>

      {/* 2. MAIN SPLIT SCREEN WORKSPACE */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        
        {/* LEFT COLUMN: Input Panels (5/12) */}
        <div className="lg:col-span-5 flex flex-col gap-6 h-full overflow-y-auto pr-0 lg:pr-1">
          {/* Accordion Editor Sections */}
          <EditorPanel 
            data={cvData} 
            onUpdate={handleUpdate}
            onClear={handleClear}
            onRestore={handleRestore}
          />
        </div>

        {/* RIGHT COLUMN: Live Interactive Document Sheet Preview (7/12) */}
        <div className="lg:col-span-7 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl min-h-[500px]">
          
          {/* Live Preview Header Toolbar */}
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-xs font-bold text-slate-300">A4 Document Preview</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono shrink-0">
                {cvData.metadata.templateId === 'classic' ? 'Europass' : 
                 cvData.metadata.templateId === 'modern' ? 'Swiss Minimal' : 'Parisian Chic'}
              </span>
            </div>

            {/* Scale View Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Zoom Scale Selector */}
              <div className="flex items-center gap-1.5 mr-2 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Zoom:</span>
                <select
                  value={previewScale}
                  onChange={(e) => setPreviewScale(Number(e.target.value))}
                  className="bg-transparent text-slate-200 font-bold text-xs focus:outline-none cursor-pointer pr-1"
                >
                  <option value={100} className="bg-slate-950 text-white">100%</option>
                  <option value={90} className="bg-slate-950 text-white">90%</option>
                  <option value={80} className="bg-slate-950 text-white">80%</option>
                  <option value={75} className="bg-slate-950 text-white">75%</option>
                  <option value={60} className="bg-slate-950 text-white">60%</option>
                  <option value={50} className="bg-slate-950 text-white">50%</option>
                </select>
              </div>

              {/* Perfect Selectable PDF Print Trigger (Recommended) */}
              <button
                id="btn-print-pdf"
                onClick={handlePrint}
                className="flex items-center gap-1.5 font-bold text-xs py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-all cursor-pointer hover:shadow-emerald-500/20"
                title="Saves as real text-based, selectable & editable PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save Selectable PDF</span>
              </button>

              {/* Flat High-Res PDF Compile Trigger */}
              <button
                id="btn-download-pdf"
                onClick={handleDownloadPdf}
                disabled={isGenerating}
                className={`flex items-center gap-1.5 font-semibold text-xs py-2 px-3 rounded-xl shadow-sm transition-all cursor-pointer ${
                  isGenerating 
                    ? 'bg-slate-800 text-slate-400 cursor-not-allowed' 
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                }`}
                title="Generates a ultra high-resolution flat image-based PDF"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Flat PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>





          {/* Alert Success Container */}
          <AnimatePresence>
            {showExportSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-emerald-950/80 border-b border-emerald-800 px-4 py-2 flex items-center gap-2 text-emerald-400 text-xs font-medium"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Your high-fidelity European CV was compiled successfully and downloaded!</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive sheet wrapper (supports horizontal scrolling for smaller screens) */}
          <div className="flex-1 overflow-auto p-4 md:p-6 flex justify-start items-start bg-slate-900/60 scrollbar-thin">
            
            {/* Standard A4 Aspect Ratio Canvas */}
            <div 
              id="cv-preview-sheet" 
              className="cv-preview-container bg-white rounded-md overflow-hidden print:shadow-none shadow-2xl shrink-0 mx-auto relative"
              style={{
                width: '210mm',
                minHeight: '297mm',
                zoom: previewScale / 100,
                '--cv-font-scale': getFontScaleNumber(cvData.metadata.fontSize) / 100,
                '--cv-line-spacing-ratio': getLineSpacingNumber(cvData.metadata.lineSpacing) / 100,
                '--cv-text-align': cvData.metadata.textAlign || 'justify',
              } as React.CSSProperties}
            >
              <CVTemplate data={cvData} />

              {/* Visual A4 Page 1 Boundary Marker */}
              <div className="absolute top-[297mm] left-0 right-0 border-b-2 border-dashed border-rose-400 opacity-75 pointer-events-none print:hidden flex items-center justify-end pr-4 z-50">
                <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-b shadow-sm uppercase tracking-wider">
                  A4 Page 1 Boundary (297mm)
                </span>
              </div>
            </div>

          </div>

          {/* Status footer for printing instructions */}
          <div className="bg-slate-950 p-3 text-center border-t border-slate-800 text-[10px] text-slate-500 flex flex-wrap justify-center items-center gap-x-4 gap-y-1">
            <span>• Compliant with CEFR linguistic descriptors (A1 - C2)</span>
            <span>• High-resolution vector PDF outputs</span>
            <span>• 100% private & secure client-side parsing</span>
          </div>

        </div>

      </main>

      {/* Auth Modal for Login / Sign Up */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthModalOpen(false);
        }}
      />

      {/* Saved CVs Version Manager Modal */}
      {user && (
        <SavedCVsModal
          isOpen={isSavedCVsModalOpen}
          onClose={() => setIsSavedCVsModalOpen(false)}
          userId={user.uid}
          currentCvData={cvData}
          currentCvId={currentCvId}
          currentCvTitle={currentCvTitle}
          onLoadCV={handleLoadCV}
          onCreateNewCV={(title, isBlank) => {
            // Handled inside modal
          }}
        />
      )}
    </div>
  );
}
