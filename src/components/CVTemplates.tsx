import React from 'react';
import { CVData, Language, WorkExperience, Education } from '../types';
import { getEffectiveSectionOrder, getSectionDisplayTitle } from '../lib/sectionUtils';
import { Mail, Phone, MapPin, Globe, Linkedin, Briefcase, GraduationCap, Award, BookOpen } from 'lucide-react';

interface CVTemplateProps {
  data: CVData;
}

// Helper to format YYYY-MM into readable Month YYYY (e.g. "2023-01" -> "Jan 2023")
export function formatDate(dateStr: string, isCurrent: boolean = false): string {
  if (isCurrent) return 'Present';
  if (!dateStr) return '';
  
  const parts = dateStr.split('-');
  if (parts.length < 2) return dateStr;
  
  const [year, month] = parts;
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const monthIndex = parseInt(month, 10) - 1;
  if (monthIndex >= 0 && monthIndex < 12) {
    return `${monthNames[monthIndex]} ${year}`;
  }
  return dateStr;
}

// Helper to compute font scale number (e.g. 100, 98, 95)
export function getFontScaleNumber(fontSizeSetting: string | number | undefined): number {
  if (typeof fontSizeSetting === 'number') return fontSizeSetting;
  if (!fontSizeSetting) return 100;
  if (fontSizeSetting === 'sm') return 92;
  if (fontSizeSetting === 'base') return 100;
  if (fontSizeSetting === 'lg') return 108;
  const parsed = parseInt(fontSizeSetting.toString().replace('%', ''), 10);
  return isNaN(parsed) ? 100 : parsed;
}

// --- 1. CLASSIC TEMPLATE: EUROPASS STANDARD ---
export function ClassicTemplate({ data }: CVTemplateProps) {
  const { personalInfo, workExperience, education, skills, languages, leadership, achievements, references, customSections, metadata } = data;
  const accent = metadata.accentColor || '#1e3a8a';
  const fontScale = getFontScaleNumber(metadata.fontSize);
  const sectionOrder = getEffectiveSectionOrder(data);
  const hiddenSections = data.hiddenSections || [];

  return (
    <div className="font-sans text-slate-800 bg-white min-h-[297mm] p-10 flex flex-col gap-6" style={{ zoom: fontScale / 100, fontSize: `${fontScale}%` }}>
      
      {/* Header Grid: Europass standard layout */}
      <div className="grid grid-cols-12 gap-6 pb-6 border-b border-slate-200">
        {/* Photo if exists */}
        {personalInfo.photo && (
          <div className="col-span-3 flex justify-center items-start">
            <div className="w-28 h-36 border border-slate-300 rounded bg-slate-50 overflow-hidden flex items-center justify-center">
              <img 
                src={personalInfo.photo} 
                alt={personalInfo.fullName} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        )}

        {/* Name and Job Title */}
        <div className={personalInfo.photo ? 'col-span-4' : 'col-span-7'}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded flex items-center justify-center text-white font-extrabold text-xs" style={{ backgroundColor: accent }}>
              e
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">europass</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 leading-none mb-2" style={{ color: accent }}>
            {personalInfo.fullName || 'Your Name'}
          </h1>
          <p className="text-lg font-medium text-slate-600 leading-tight">
            {personalInfo.jobTitle || 'Desired Position / Professional Title'}
          </p>
        </div>

        {/* Contact details */}
        <div className="col-span-5 flex flex-col gap-2 text-xs text-slate-600 border-l border-slate-100 pl-4">
          {personalInfo.email && (
            <div className="flex items-start gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span className="break-words whitespace-normal text-slate-600 leading-tight">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-start gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span className="break-words whitespace-normal text-slate-600 leading-tight">{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.address && (
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span className="break-words whitespace-normal text-slate-600 leading-tight">{personalInfo.address}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-start gap-2">
              <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span className="break-words whitespace-normal text-slate-600 leading-tight">{personalInfo.website}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-start gap-2">
              <Linkedin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span className="break-words whitespace-normal text-slate-600 leading-tight">{personalInfo.linkedin}</span>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Sections rendering in order */}
      {sectionOrder.map((secId) => {
        if (hiddenSections.includes(secId)) return null;

        if (secId === 'summary' && personalInfo.summary) {
          return (
            <div key="summary" className="grid grid-cols-12 gap-6 py-2">
              <div className="col-span-3 text-right pr-4 font-bold uppercase tracking-wider text-xs" style={{ color: accent }}>
                {getSectionDisplayTitle('summary', data)}
              </div>
              <div className="col-span-9 text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">
                {personalInfo.summary}
              </div>
            </div>
          );
        }

        if (secId === 'workExperience' && workExperience && workExperience.length > 0) {
          return (
            <div key="workExperience" className="grid grid-cols-12 gap-6 pt-4">
              <div className="col-span-3 text-right pr-4 font-bold uppercase tracking-wider text-xs pt-1" style={{ color: accent }}>
                {getSectionDisplayTitle('workExperience', data)}
              </div>
              <div className="col-span-9 flex flex-col gap-6 border-l-2 border-slate-100 pl-6 -ml-[1px]">
                {workExperience.map((exp) => (
                  <div key={exp.id} className="relative page-break-avoid">
                    <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full border-2 bg-white" style={{ borderColor: accent }} />
                    <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-1 mb-1">
                      <h3 className="text-base font-bold text-slate-900">{exp.position}</h3>
                      <div className="text-xs font-medium text-slate-500 bg-slate-100 py-0.5 px-2 rounded shrink-0">
                        {formatDate(exp.startDate)} – {formatDate(exp.endDate, exp.current)}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-slate-700 mb-2">
                      {exp.company} {exp.location ? `| ${exp.location}` : ''}
                    </div>
                    <div className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">
                      {exp.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        if (secId === 'education' && education && education.length > 0) {
          return (
            <div key="education" className="grid grid-cols-12 gap-6 pt-4">
              <div className="col-span-3 text-right pr-4 font-bold uppercase tracking-wider text-xs pt-1" style={{ color: accent }}>
                {getSectionDisplayTitle('education', data)}
              </div>
              <div className="col-span-9 flex flex-col gap-6 border-l-2 border-slate-100 pl-6 -ml-[1px]">
                {education.map((edu) => (
                  <div key={edu.id} className="relative page-break-avoid">
                    <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full border-2 bg-white" style={{ borderColor: accent }} />
                    <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-1 mb-1">
                      <h3 className="text-base font-bold text-slate-900">{edu.degree}</h3>
                      <div className="text-xs font-medium text-slate-500 bg-slate-100 py-0.5 px-2 rounded shrink-0">
                        {formatDate(edu.startDate)} – {formatDate(edu.endDate, edu.current)}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-slate-700 mb-1">
                      {edu.school} {edu.location ? `| ${edu.location}` : ''}
                    </div>
                    {edu.description && (
                      <div className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed mt-1">
                        {edu.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        }

        if (secId === 'skills' && skills && skills.length > 0) {
          return (
            <div key="skills" className="grid grid-cols-12 gap-6 pt-4 page-break-avoid">
              <div className="col-span-3 text-right pr-4 font-bold uppercase tracking-wider text-xs" style={{ color: accent }}>
                {getSectionDisplayTitle('skills', data)}
              </div>
              <div className="col-span-9 flex flex-wrap gap-1.5 border-l-2 border-slate-100 pl-6 -ml-[1px]">
                {skills.map((skill, index) => (
                  <span key={index} className="inline-block bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium px-2.5 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          );
        }

        if (secId === 'languages' && languages && languages.length > 0) {
          return (
            <div key="languages" className="grid grid-cols-12 gap-6 pt-4 page-break-avoid">
              <div className="col-span-3 text-right pr-4 font-bold uppercase tracking-wider text-xs" style={{ color: accent }}>
                {getSectionDisplayTitle('languages', data)}
              </div>
              <div className="col-span-9 border-l-2 border-slate-100 pl-6 -ml-[1px]">
                <div className="grid grid-cols-2 gap-4">
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex items-center justify-between border-b border-slate-100 pb-1 text-sm">
                      <span className="font-semibold text-slate-800">{lang.name}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white px-2 py-0.5 rounded uppercase tracking-wider" style={{ backgroundColor: accent }}>
                          {lang.level}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {lang.level === 'C2' || lang.level === 'C1' ? 'Proficient' : lang.level === 'B2' || lang.level === 'B1' ? 'Independent' : 'Basic'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        if (secId === 'leadership' && leadership && leadership.length > 0) {
          return (
            <div key="leadership" className="grid grid-cols-12 gap-6 pt-4">
              <div className="col-span-3 text-right pr-4 font-bold uppercase tracking-wider text-xs pt-1" style={{ color: accent }}>
                {getSectionDisplayTitle('leadership', data)}
              </div>
              <div className="col-span-9 flex flex-col gap-4 border-l-2 border-slate-100 pl-6 -ml-[1px]">
                {leadership.map((lead) => (
                  <div key={lead.id} className="relative page-break-avoid">
                    <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full border-2 bg-white" style={{ borderColor: accent }} />
                    <div className="flex justify-between items-baseline gap-1 mb-1">
                      <h3 className="text-base font-bold text-slate-900">{lead.position}</h3>
                      <div className="text-xs font-medium text-slate-500 bg-slate-100 py-0.5 px-2 rounded shrink-0">
                        {formatDate(lead.startDate)} – {formatDate(lead.endDate, lead.current)}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-slate-700 mb-1">{lead.company}</div>
                    {lead.description && <div className="text-slate-600 text-sm whitespace-pre-wrap">{lead.description}</div>}
                  </div>
                ))}
              </div>
            </div>
          );
        }

        if (secId === 'achievements' && achievements && achievements.length > 0) {
          return (
            <div key="achievements" className="grid grid-cols-12 gap-6 pt-4 page-break-avoid">
              <div className="col-span-3 text-right pr-4 font-bold uppercase tracking-wider text-xs" style={{ color: accent }}>
                {getSectionDisplayTitle('achievements', data)}
              </div>
              <div className="col-span-9 border-l-2 border-slate-100 pl-6 -ml-[1px] space-y-2">
                {achievements.map((ach) => (
                  <div key={ach.id} className="text-xs text-slate-800">
                    <span className="font-bold text-slate-900">{ach.title}</span>
                    {ach.description ? `: ${ach.description}` : ''}
                  </div>
                ))}
              </div>
            </div>
          );
        }

        if (secId === 'references' && references && references.length > 0) {
          return (
            <div key="references" className="grid grid-cols-12 gap-6 pt-4 page-break-avoid">
              <div className="col-span-3 text-right pr-4 font-bold uppercase tracking-wider text-xs" style={{ color: accent }}>
                {getSectionDisplayTitle('references', data)}
              </div>
              <div className="col-span-9 border-l-2 border-slate-100 pl-6 -ml-[1px] grid grid-cols-2 gap-4 text-xs">
                {references.map((ref) => (
                  <div key={ref.id}>
                    <p className="font-bold text-slate-900">{ref.name}</p>
                    <p className="text-slate-600">{ref.title}{ref.organization ? `, ${ref.organization}` : ''}</p>
                    {ref.phone && <p className="text-slate-500">Tel: {ref.phone}</p>}
                    {ref.email && <p className="text-slate-500">Email: {ref.email}</p>}
                  </div>
                ))}
              </div>
            </div>
          );
        }

        if (secId.startsWith('custom-')) {
          const custom = (customSections || []).find(c => c.id === secId);
          if (!custom || !custom.items || custom.items.length === 0) return null;

          return (
            <div key={secId} className="grid grid-cols-12 gap-6 pt-4 page-break-avoid">
              <div className="col-span-3 text-right pr-4 font-bold uppercase tracking-wider text-xs pt-1" style={{ color: accent }}>
                {custom.title}
              </div>
              <div className="col-span-9 flex flex-col gap-4 border-l-2 border-slate-100 pl-6 -ml-[1px]">
                {custom.items.map((item) => (
                  <div key={item.id} className="relative page-break-avoid">
                    <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full border-2 bg-white" style={{ borderColor: accent }} />
                    <div className="flex justify-between items-baseline gap-2 mb-0.5">
                      <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                      {item.date && (
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 py-0.5 px-2 rounded shrink-0">
                          {item.date}
                        </span>
                      )}
                    </div>
                    {item.subtitle && <p className="text-sm font-semibold text-slate-700 mb-1">{item.subtitle}</p>}
                    {item.description && <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed mt-1">{item.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          );
        }

        return null;
      })}

    </div>
  );
}


// --- 2. MODERN TEMPLATE: SWISS MINIMAL ---
export function ModernTemplate({ data }: CVTemplateProps) {
  const { personalInfo, workExperience, education, skills, languages, metadata } = data;
  const accent = metadata.accentColor || '#374151';
  const fontScale = getFontScaleNumber(metadata.fontSize);

  return (
    <div className="font-sans text-zinc-800 bg-white min-h-[297mm] grid grid-cols-12" style={{ zoom: fontScale / 100, fontSize: `${fontScale}%` }}>
      
      {/* Sidebar: Left Column (4/12) */}
      <div className="col-span-4 bg-zinc-50 border-r border-zinc-200 p-6 flex flex-col gap-6 h-full">
        {/* Photo */}
        {personalInfo.photo ? (
          <div className="flex justify-center mb-1">
            <div className="w-28 h-28 rounded-full border-2 bg-white overflow-hidden flex items-center justify-center shadow-sm" style={{ borderColor: accent }}>
              <img 
                src={personalInfo.photo} 
                alt={personalInfo.fullName} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-1">
            <div className="w-20 h-20 rounded-full border border-dashed border-zinc-300 flex items-center justify-center bg-zinc-100 text-zinc-400">
              <span className="text-xs text-center px-2">No Photo</span>
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div className="flex flex-col gap-3 text-xs">
          <h3 className="font-bold text-xs uppercase tracking-widest text-zinc-400 border-b border-zinc-200 pb-1">
            Contact
          </h3>
          <div className="flex flex-col gap-2.5 text-zinc-600">
            {personalInfo.email && (
              <div className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: accent }} />
                <span className="break-words whitespace-normal text-zinc-600 leading-tight">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: accent }} />
                <span className="break-words whitespace-normal text-zinc-600 leading-tight">{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.address && (
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: accent }} />
                <span className="break-words whitespace-normal text-zinc-600 leading-tight">{personalInfo.address}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-start gap-2">
                <Globe className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: accent }} />
                <span className="break-words whitespace-normal text-zinc-600 leading-tight">{personalInfo.website}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-start gap-2">
                <Linkedin className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: accent }} />
                <span className="break-words whitespace-normal text-zinc-600 leading-tight">{personalInfo.linkedin}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills Section */}
        {skills && skills.length > 0 && (
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-xs uppercase tracking-widest text-zinc-400 border-b border-zinc-200 pb-1">
              {getSectionDisplayTitle('skills', data)}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="bg-white border border-zinc-200 text-zinc-700 text-[11px] px-2 py-0.5 rounded font-medium shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages Section */}
        {languages && languages.length > 0 && (
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-xs uppercase tracking-widest text-zinc-400 border-b border-zinc-200 pb-1">
              {getSectionDisplayTitle('languages', data)}
            </h3>
            <div className="flex flex-col gap-3">
              {languages.map((lang) => (
                <div key={lang.id} className="text-xs">
                  <div className="flex justify-between font-semibold text-zinc-700 mb-1">
                    <span>{lang.name}</span>
                    <span className="text-zinc-500 font-bold">{lang.level}</span>
                  </div>
                  {/* Custom modern progress indicator */}
                  <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        backgroundColor: accent,
                        width: lang.level === 'C2' ? '100%' :
                               lang.level === 'C1' ? '85%' :
                               lang.level === 'B2' ? '70%' :
                               lang.level === 'B1' ? '55%' :
                               lang.level === 'A2' ? '40%' : '25%'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Body: Right Column (8/12) */}
      <div className="col-span-8 p-10 flex flex-col gap-8 h-full">
        {/* Name and Job Title */}
        <div>
          <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight leading-none mb-2 uppercase">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          <div className="h-1.5 w-20 mb-3 rounded" style={{ backgroundColor: accent }} />
          <p className="text-lg font-medium text-zinc-600 uppercase tracking-widest leading-none">
            {personalInfo.jobTitle || 'Your Profession'}
          </p>
        </div>

        {/* Professional Summary */}
        {personalInfo.summary && (
          <div className="flex flex-col gap-2">
            <h2 className="text-xs uppercase font-bold tracking-wider text-zinc-400">Profile</h2>
            <p className="text-zinc-600 text-sm leading-relaxed border-l-2 pl-4 py-0.5" style={{ borderColor: accent }}>
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Work Experience */}
        {workExperience && workExperience.length > 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-800 border-b border-zinc-100 pb-2 flex items-center gap-2">
              <Briefcase className="w-4 h-4" style={{ color: accent }} />
              Professional Experience
            </h2>
            <div className="flex flex-col gap-6">
              {workExperience.map((exp) => (
                <div key={exp.id} className="page-break-avoid">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <div>
                      <h3 className="text-base font-bold text-zinc-900">{exp.position}</h3>
                      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                        {exp.company} {exp.location ? `— ${exp.location}` : ''}
                      </p>
                    </div>
                    <span className="text-xs font-mono bg-zinc-100 text-zinc-600 py-0.5 px-2 rounded font-medium shrink-0">
                      {formatDate(exp.startDate)} – {formatDate(exp.endDate, exp.current)}
                    </span>
                  </div>
                  <p className="text-zinc-600 text-sm whitespace-pre-wrap leading-relaxed mt-2 pl-4 border-l border-zinc-100">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-800 border-b border-zinc-100 pb-2 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" style={{ color: accent }} />
              Education & Academic
            </h2>
            <div className="flex flex-col gap-5">
              {education.map((edu) => (
                <div key={edu.id} className="page-break-avoid">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <div>
                      <h3 className="text-base font-bold text-zinc-900">{edu.degree}</h3>
                      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                        {edu.school} {edu.location ? `— ${edu.location}` : ''}
                      </p>
                    </div>
                    <span className="text-xs font-mono bg-zinc-100 text-zinc-600 py-0.5 px-2 rounded font-medium shrink-0">
                      {formatDate(edu.startDate)} – {formatDate(edu.endDate, edu.current)}
                    </span>
                  </div>
                  {edu.description && (
                    <p className="text-zinc-600 text-sm whitespace-pre-wrap leading-relaxed mt-1 pl-4 border-l border-zinc-100">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}


// --- 3. CREATIVE TEMPLATE: PARISIAN CHIC ---
export function CreativeTemplate({ data }: CVTemplateProps) {
  const { personalInfo, workExperience, education, skills, languages, metadata } = data;
  const accent = metadata.accentColor || '#581c87';
  const fontScale = getFontScaleNumber(metadata.fontSize);

  return (
    <div className="font-serif text-stone-800 bg-[#FAF9F6] min-h-[297mm] p-12 flex flex-col gap-8 shadow-inner" style={{ zoom: fontScale / 100, fontSize: `${fontScale}%` }}>
      
      {/* Header Panel - Elegantly Centered */}
      <div className="flex flex-col items-center text-center border-b border-stone-200 pb-6">
        
        {/* Photo - if uploaded, elegant circular/antique frame */}
        {personalInfo.photo && (
          <div className="mb-4">
            <div className="w-24 h-24 rounded-full border border-stone-300 p-1 bg-[#FAF9F6] shadow-sm overflow-hidden flex items-center justify-center">
              <img 
                src={personalInfo.photo} 
                alt={personalInfo.fullName} 
                className="w-full h-full object-cover rounded-full" 
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        )}

        <h1 className="text-4xl font-normal tracking-widest text-stone-900 uppercase font-serif mb-1">
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        <p className="text-base italic text-stone-500 font-light tracking-wide mb-4">
          {personalInfo.jobTitle || 'Professional Title'}
        </p>

        {/* Contact details separated by bullet points */}
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1.5 text-xs text-stone-500 font-sans tracking-wide max-w-xl">
          {personalInfo.email && (
            <span className="flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-stone-400 shrink-0" />
              {personalInfo.email}
            </span>
          )}
          {(personalInfo.email && personalInfo.phone) && <span className="text-stone-300">•</span>}
          {personalInfo.phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-stone-400 shrink-0" />
              {personalInfo.phone}
            </span>
          )}
          {(personalInfo.phone && personalInfo.address) && <span className="text-stone-300">•</span>}
          {personalInfo.address && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
              {personalInfo.address}
            </span>
          )}
          {(personalInfo.address && (personalInfo.website || personalInfo.linkedin)) && <span className="text-stone-300">•</span>}
          {personalInfo.website && (
            <span className="flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-stone-400 shrink-0" />
              {personalInfo.website}
            </span>
          )}
          {(personalInfo.website && personalInfo.linkedin) && <span className="text-stone-300">•</span>}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1.5">
              <Linkedin className="w-3 h-3 text-stone-400 shrink-0" />
              {personalInfo.linkedin}
            </span>
          )}
        </div>
      </div>

      {/* Summary / Introduction */}
      {personalInfo.summary && (
        <div className="max-w-2xl mx-auto text-center font-serif text-stone-600 text-[13px] leading-relaxed italic border-b border-stone-100 pb-6">
          "{personalInfo.summary}"
        </div>
      )}

      {/* Main Sections */}
      <div className="flex flex-col gap-8">
        
        {/* Work Experience */}
        {workExperience && workExperience.length > 0 && (
          <div className="flex flex-col gap-4">
            {/* Elegant section title */}
            <div className="text-center my-1">
              <h2 className="text-xs tracking-[0.25em] font-medium text-stone-400 uppercase font-sans py-1 border-t border-b border-stone-200 inline-block px-8">
                Professional Journey
              </h2>
            </div>
            
            <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
              {workExperience.map((exp) => (
                <div key={exp.id} className="page-break-avoid">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h3 className="text-base font-semibold text-stone-950 font-serif">{exp.position}</h3>
                      <span className="text-xs text-stone-400 font-sans">at</span>
                      <span className="text-sm italic font-medium text-stone-800 font-serif">{exp.company}</span>
                    </div>
                    <span className="text-xs font-sans text-stone-500 italic shrink-0" style={{ color: accent }}>
                      {formatDate(exp.startDate)} – {formatDate(exp.endDate, exp.current)}
                    </span>
                  </div>
                  {exp.location && (
                    <span className="text-[11px] font-sans text-stone-400 uppercase tracking-widest block mb-2">
                      {exp.location}
                    </span>
                  )}
                  <p className="text-stone-600 text-xs leading-relaxed font-serif whitespace-pre-wrap pl-3 border-l border-stone-200 italic">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {education && education.length > 0 && (
          <div className="flex flex-col gap-4">
            {/* Elegant section title */}
            <div className="text-center my-1">
              <h2 className="text-xs tracking-[0.25em] font-medium text-stone-400 uppercase font-sans py-1 border-t border-b border-stone-200 inline-block px-8">
                Academics & Degrees
              </h2>
            </div>
            
            <div className="flex flex-col gap-5 max-w-3xl mx-auto w-full">
              {education.map((edu) => (
                <div key={edu.id} className="page-break-avoid">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h3 className="text-base font-semibold text-stone-950 font-serif">{edu.degree}</h3>
                      <span className="text-xs text-stone-400 font-sans">at</span>
                      <span className="text-sm italic font-medium text-stone-800 font-serif">{edu.school}</span>
                    </div>
                    <span className="text-xs font-sans text-stone-500 italic shrink-0" style={{ color: accent }}>
                      {formatDate(edu.startDate)} – {formatDate(edu.endDate, edu.current)}
                    </span>
                  </div>
                  {edu.location && (
                    <span className="text-[11px] font-sans text-stone-400 uppercase tracking-widest block mb-1">
                      {edu.location}
                    </span>
                  )}
                  {edu.description && (
                    <p className="text-stone-600 text-xs leading-relaxed font-serif whitespace-pre-wrap pl-3 border-l border-stone-200 italic mt-1">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Split: Skills & Languages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto w-full border-t border-stone-150 pt-6">
          {/* Skills Column */}
          {skills && skills.length > 0 && (
            <div className="flex flex-col gap-3 page-break-avoid">
              <h3 className="text-[11px] tracking-widest font-bold text-stone-400 uppercase font-sans border-b border-stone-100 pb-1.5 text-center md:text-left">
                Expertise & Toolkit
              </h3>
              <div className="flex flex-wrap justify-center md:justify-start gap-1.5">
                {skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="bg-[#FAF9F6] border border-stone-200 text-stone-700 text-xs font-sans px-2 py-0.5 rounded italic shadow-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages Column */}
          {languages && languages.length > 0 && (
            <div className="flex flex-col gap-3 page-break-avoid">
              <h3 className="text-[11px] tracking-widest font-bold text-stone-400 uppercase font-sans border-b border-stone-100 pb-1.5 text-center md:text-left">
                Linguistic Skills
              </h3>
              <div className="flex flex-col gap-2 font-sans">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between items-baseline text-xs border-b border-dotted border-stone-200 pb-1">
                    <span className="font-semibold text-stone-800">{lang.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] tracking-widest bg-stone-150 text-stone-600 border border-stone-200 font-bold px-1.5 py-0.2 rounded uppercase">
                        {lang.level}
                      </span>
                      <span className="text-[10px] text-stone-400 italic">
                        {lang.level === 'C2' || lang.level === 'C1' ? 'fluent' : lang.level === 'B2' || lang.level === 'B1' ? 'intermediate' : 'basic'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

// --- 4. EDITORIAL TEMPLATE: HARVARD EXECUTIVE ---
export function EditorialTemplate({ data }: CVTemplateProps) {
  const { personalInfo, workExperience, education, skills, languages, metadata } = data;
  const accent = metadata.accentColor || '#1e3a8a';
  const fontScale = getFontScaleNumber(metadata.fontSize);

  return (
    <div className="font-serif text-slate-900 bg-white min-h-[297mm] p-12 flex flex-col gap-6" style={{ zoom: fontScale / 100, fontSize: `${fontScale}%` }}>
      {/* Centered Name and Contact Info */}
      <div className="flex flex-col items-center text-center">
        <h1 className="text-3xl font-normal tracking-wide text-slate-950 uppercase border-b-2 border-double pb-2 mb-3 w-full" style={{ borderColor: accent }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        
        {personalInfo.jobTitle && (
          <p className="text-sm font-sans uppercase tracking-[0.15em] text-slate-500 font-bold mb-3">
            {personalInfo.jobTitle}
          </p>
        )}

        {/* Contact panel: Single horizontal line separated by diamond dots */}
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-[11px] font-sans text-slate-600 max-w-2xl">
          {personalInfo.email && <span className="break-words">{personalInfo.email}</span>}
          {personalInfo.phone && (
            <>
              <span className="text-slate-300">♦</span>
              <span className="break-words">{personalInfo.phone}</span>
            </>
          )}
          {personalInfo.address && (
            <>
              <span className="text-slate-300">♦</span>
              <span className="break-words">{personalInfo.address}</span>
            </>
          )}
          {personalInfo.website && (
            <>
              <span className="text-slate-300">♦</span>
              <span className="underline break-words">{personalInfo.website}</span>
            </>
          )}
          {personalInfo.linkedin && (
            <>
              <span className="text-slate-300">♦</span>
              <span className="underline break-words">{personalInfo.linkedin}</span>
            </>
          )}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mt-2 text-slate-800 text-sm leading-relaxed border-l-4 pl-4 italic" style={{ borderColor: accent }}>
          {personalInfo.summary}
        </div>
      )}

      {/* Work Experience */}
      {workExperience && workExperience.length > 0 && (
        <div className="flex flex-col gap-3 mt-2">
          <h2 className="text-xs uppercase font-sans font-bold tracking-[0.2em] border-b pb-1 text-slate-500" style={{ color: accent, borderColor: accent }}>
            Professional Experience
          </h2>
          <div className="flex flex-col gap-4">
            {workExperience.map((exp) => (
              <div key={exp.id} className="page-break-avoid">
                <div className="flex justify-between items-baseline mb-1">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-950 uppercase">{exp.position}</h3>
                    <span className="text-xs text-slate-400">—</span>
                    <span className="text-sm italic font-medium text-slate-700">{exp.company}</span>
                    {exp.location && <span className="text-xs text-slate-400 font-sans">({exp.location})</span>}
                  </div>
                  <span className="text-xs font-sans font-bold text-slate-500 shrink-0">
                    {formatDate(exp.startDate)} – {formatDate(exp.endDate, exp.current)}
                  </span>
                </div>
                <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-wrap font-serif">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="flex flex-col gap-3 mt-2">
          <h2 className="text-xs uppercase font-sans font-bold tracking-[0.2em] border-b pb-1 text-slate-500" style={{ color: accent, borderColor: accent }}>
            Education & Academic Background
          </h2>
          <div className="flex flex-col gap-4">
            {education.map((edu) => (
              <div key={edu.id} className="page-break-avoid">
                <div className="flex justify-between items-baseline mb-1">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-950 uppercase">{edu.degree}</h3>
                    <span className="text-xs text-slate-400">—</span>
                    <span className="text-sm italic font-medium text-slate-700">{edu.school}</span>
                    {edu.location && <span className="text-xs text-slate-400 font-sans">({edu.location})</span>}
                  </div>
                  <span className="text-xs font-sans font-bold text-slate-500 shrink-0">
                    {formatDate(edu.startDate)} – {formatDate(edu.endDate, edu.current)}
                  </span>
                </div>
                {edu.description && (
                  <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-wrap font-serif">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom section (Skills and Languages) side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="flex flex-col gap-2 page-break-avoid">
            <h2 className="text-xs uppercase font-sans font-bold tracking-[0.2em] border-b pb-1 text-slate-500" style={{ color: accent, borderColor: accent }}>
              Expertise & Skills
            </h2>
            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map((skill, index) => (
                <span key={index} className="text-xs font-sans bg-slate-50 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded italic">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <div className="flex flex-col gap-2 page-break-avoid">
            <h2 className="text-xs uppercase font-sans font-bold tracking-[0.2em] border-b pb-1 text-slate-500" style={{ color: accent, borderColor: accent }}>
              Languages
            </h2>
            <div className="flex flex-col gap-1.5 pt-1">
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between items-baseline text-xs font-sans border-b border-dashed border-slate-100 pb-1">
                  <span className="font-semibold text-slate-800">{lang.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {lang.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- 5. TECH TEMPLATE: DEVELOPER MODERN MONO ---
export function TechTemplate({ data }: CVTemplateProps) {
  const { personalInfo, workExperience, education, skills, languages, metadata } = data;
  const accent = metadata.accentColor || '#0ea5e9';
  const fontScale = getFontScaleNumber(metadata.fontSize);

  return (
    <div className="font-sans text-slate-800 bg-white min-h-[297mm] p-10 flex flex-col gap-6" style={{ zoom: fontScale / 100, fontSize: `${fontScale}%` }}>
      
      {/* Tech-Branded Header Block */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b-2 border-slate-900 pb-5">
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accent }} />
            <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-slate-400">Available for Opportunities</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none mb-1">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.jobTitle && (
            <p className="font-mono text-sm uppercase tracking-wide font-bold" style={{ color: accent }}>
              &lt; {personalInfo.jobTitle} /&gt;
            </p>
          )}
        </div>

        {/* Contact Block in clean Mono Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-1.5 text-xs font-mono w-full md:w-auto shrink-0 shadow-sm">
          {personalInfo.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span className="break-all">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span className="break-all">{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span className="underline break-all">{personalInfo.website}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-2">
              <Linkedin className="w-3.5 h-3.5 text-slate-400" />
              <span className="underline break-all">{personalInfo.linkedin}</span>
            </div>
          )}
        </div>
      </div>

      {/* Profile summary */}
      {personalInfo.summary && (
        <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 text-slate-700 text-sm leading-relaxed relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: accent }} />
          <span className="font-mono text-[10px] font-bold text-slate-400 block mb-1">01 // PROFILE SUMMARY</span>
          {personalInfo.summary}
        </div>
      )}

      {/* Main Content Areas */}
      {workExperience && workExperience.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <span>02 //</span>
            <span className="text-slate-900">Work Experience</span>
          </h2>
          <div className="flex flex-col gap-5 pl-1.5 border-l-2 border-slate-100 ml-1">
            {workExperience.map((exp) => (
              <div key={exp.id} className="relative page-break-avoid pl-5">
                {/* Micro tech timeline node */}
                <div className="absolute -left-[10px] top-1.5 w-4 h-1.5 rounded-full bg-white border border-slate-300" style={{ borderColor: accent }} />
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                  <h3 className="text-base font-bold text-slate-900">{exp.position}</h3>
                  <span className="font-mono text-xs font-bold py-0.5 px-2 bg-slate-100 text-slate-600 rounded shrink-0">
                    [{formatDate(exp.startDate)} – {formatDate(exp.endDate, exp.current)}]
                  </span>
                </div>
                
                <div className="font-mono text-xs font-semibold text-slate-500 mb-2">
                  {exp.company} {exp.location ? `| ${exp.location}` : ''}
                </div>
                
                <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <span>03 //</span>
            <span className="text-slate-900">Education Background</span>
          </h2>
          <div className="flex flex-col gap-5 pl-1.5 border-l-2 border-slate-100 ml-1">
            {education.map((edu) => (
              <div key={edu.id} className="relative page-break-avoid pl-5">
                <div className="absolute -left-[10px] top-1.5 w-4 h-1.5 rounded-full bg-white border border-slate-300" style={{ borderColor: accent }} />
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                  <h3 className="text-base font-bold text-slate-950">{edu.degree}</h3>
                  <span className="font-mono text-xs font-bold py-0.5 px-2 bg-slate-100 text-slate-600 rounded shrink-0">
                    [{formatDate(edu.startDate)} – {formatDate(edu.endDate, edu.current)}]
                  </span>
                </div>
                
                <div className="font-mono text-xs font-semibold text-slate-500 mb-2">
                  {edu.school} {edu.location ? `| ${edu.location}` : ''}
                </div>
                
                {edu.description && (
                  <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid: Skills & Languages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="flex flex-col gap-2 page-break-avoid">
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
              <span>04 //</span>
              <span className="text-slate-900">Core Stack</span>
            </h2>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {skills.map((skill, index) => (
                <span key={index} className="font-mono text-xs bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-0.5 rounded font-bold shadow-xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <div className="flex flex-col gap-2 page-break-avoid">
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
              <span>05 //</span>
              <span className="text-slate-900">Linguistic Keys</span>
            </h2>
            <div className="flex flex-col gap-2 pt-1 font-mono text-xs">
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between items-center border-b border-slate-100 pb-1">
                  <span className="font-semibold text-slate-800">{lang.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-white px-2 py-0.5 rounded" style={{ backgroundColor: accent }}>
                      {lang.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

// Helper to adjust hex color brightness for secondary shades in trendy templates
function adjustColorBrightness(hex: string, percent: number): string {
  let cleanedHex = hex.replace("#", "");
  if (cleanedHex.length === 3) {
    cleanedHex = cleanedHex.split("").map(char => char + char).join("");
  }
  let num = parseInt(cleanedHex, 16);
  if (isNaN(num)) return hex;
  let amt = Math.round(2.55 * percent);
  let R = (num >> 16) + amt;
  let G = (num >> 8 & 0x00FF) + amt;
  let B = (num & 0x0000FF) + amt;
  
  R = Math.max(0, Math.min(255, R));
  G = Math.max(0, Math.min(255, G));
  B = Math.max(0, Math.min(255, B));
  
  return "#" + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
}

// --- 6. VIBRANT TEMPLATE: TRENDY GRADIENT SIDEBAR ---
export function VibrantTemplate({ data }: CVTemplateProps) {
  const { personalInfo, workExperience, education, skills, languages, metadata } = data;
  const accent = metadata.accentColor || '#3b82f6';
  const fontScale = getFontScaleNumber(metadata.fontSize);

  return (
    <div className="font-sans text-slate-800 bg-white min-h-[297mm] flex flex-row" style={{ zoom: fontScale / 100, fontSize: `${fontScale}%` }}>
      
      {/* Left Sidebar (35% width) - Colorful Gradient */}
      <div className="w-[35%] text-white p-8 flex flex-col gap-6 shrink-0 relative overflow-hidden" 
           style={{ 
             background: `linear-gradient(135deg, ${accent}, ${adjustColorBrightness(accent, -40)})`,
           }}>
        
        {/* Soft decorative background circles for modern premium look */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-black/10 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Photo */}
          {personalInfo.photo ? (
            <div className="w-24 h-24 rounded-full border-2 border-white/40 shadow-lg overflow-hidden bg-white/10 flex items-center justify-center mb-4 shrink-0">
              <img 
                src={personalInfo.photo} 
                alt={personalInfo.fullName} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-white/15 border-2 border-white/20 flex items-center justify-center text-2xl font-bold mb-4 shrink-0 uppercase">
              {personalInfo.fullName ? personalInfo.fullName.charAt(0) : 'Y'}
            </div>
          )}

          <h1 className="text-xl font-extrabold tracking-tight leading-tight uppercase">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.jobTitle && (
            <p className="text-xs font-semibold text-white/90 bg-black/20 px-3 py-1 rounded-full mt-2 inline-block uppercase tracking-wider">
              {personalInfo.jobTitle}
            </p>
          )}
        </div>

        {/* Contact panel */}
        <div className="relative z-10 flex flex-col gap-3.5 border-t border-white/25 pt-5 text-xs">
          <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest text-white/60">Contact Details</h3>
          
          {personalInfo.email && (
            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-white/80 shrink-0 mt-0.5" />
              <span className="break-all whitespace-normal text-white/95 leading-tight">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-white/80 shrink-0 mt-0.5" />
              <span className="break-all whitespace-normal text-white/95 leading-tight">{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.address && (
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-white/80 shrink-0 mt-0.5" />
              <span className="break-words whitespace-normal text-white/95 leading-tight">{personalInfo.address}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-start gap-2.5">
              <Globe className="w-4 h-4 text-white/80 shrink-0 mt-0.5" />
              <span className="break-all underline text-white/95 leading-tight">{personalInfo.website}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-start gap-2.5">
              <Linkedin className="w-4 h-4 text-white/80 shrink-0 mt-0.5" />
              <span className="break-all underline text-white/95 leading-tight">{personalInfo.linkedin}</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="relative z-10 flex flex-col gap-3 border-t border-white/25 pt-5">
            <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest text-white/60">Expertise & Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, index) => (
                <span key={index} className="text-xs bg-white/15 hover:bg-white/25 transition-colors border border-white/10 text-white px-2.5 py-1 rounded-md">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <div className="relative z-10 flex flex-col gap-3 border-t border-white/25 pt-5 mt-auto">
            <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest text-white/60">Languages</h3>
            <div className="flex flex-col gap-2">
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between items-center text-xs">
                  <span className="font-medium text-white">{lang.name}</span>
                  <span className="text-[10px] uppercase font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">
                    {lang.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content Area (65% width) - Sleek Modern White */}
      <div className="w-[65%] p-10 flex flex-col gap-6">
        {/* Profile Summary */}
        {personalInfo.summary && (
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: accent }}>
              <span className="w-1.5 h-3 rounded-full" style={{ backgroundColor: accent }} />
              About Me
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Work Experience */}
        {workExperience && workExperience.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: accent }}>
              <span className="w-1.5 h-3 rounded-full" style={{ backgroundColor: accent }} />
              Professional Experience
            </h2>
            <div className="flex flex-col gap-5 border-l border-slate-100 pl-4 ml-1">
              {workExperience.map((exp) => (
                <div key={exp.id} className="relative page-break-avoid">
                  {/* Outer timeline ring */}
                  <div className="absolute -left-[21px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2" style={{ borderColor: accent }} />
                  
                  <div className="flex justify-between items-baseline mb-1 flex-wrap gap-x-2">
                    <h3 className="text-base font-extrabold text-slate-900">{exp.position}</h3>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-50 text-slate-500 border border-slate-100">
                      {formatDate(exp.startDate)} – {formatDate(exp.endDate, exp.current)}
                    </span>
                  </div>
                  
                  <p className="text-xs font-bold text-slate-500 mb-2">
                    {exp.company} {exp.location ? `• ${exp.location}` : ''}
                  </p>
                  
                  <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-wrap">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: accent }}>
              <span className="w-1.5 h-3 rounded-full" style={{ backgroundColor: accent }} />
              Education & Background
            </h2>
            <div className="flex flex-col gap-5 border-l border-slate-100 pl-4 ml-1">
              {education.map((edu) => (
                <div key={edu.id} className="relative page-break-avoid">
                  {/* Outer timeline ring */}
                  <div className="absolute -left-[21px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2" style={{ borderColor: accent }} />
                  
                  <div className="flex justify-between items-baseline mb-1 flex-wrap gap-x-2">
                    <h3 className="text-base font-extrabold text-slate-900">{edu.degree}</h3>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-50 text-slate-500 border border-slate-100">
                      {formatDate(edu.startDate)} – {formatDate(edu.endDate, edu.current)}
                    </span>
                  </div>
                  
                  <p className="text-xs font-bold text-slate-500 mb-2">
                    {edu.school} {edu.location ? `• ${edu.location}` : ''}
                  </p>
                  
                  {edu.description && (
                    <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-wrap">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

// --- 7. ELEGANT TEMPLATE: EXECUTIVE ROYALE ---
export function ElegantTemplate({ data }: CVTemplateProps) {
  const { personalInfo, workExperience, education, skills, languages, metadata } = data;
  const accent = metadata.accentColor || '#1e3a8a';
  const fontScale = getFontScaleNumber(metadata.fontSize);

  return (
    <div className="font-sans text-slate-800 bg-white min-h-[297mm] p-10 flex flex-col gap-6 relative animate-fade-in" style={{ zoom: fontScale / 100, fontSize: `${fontScale}%` }}>
      
      {/* Outer border decoration for an elite executive feel */}
      <div className="absolute inset-4 border-2 pointer-events-none rounded" style={{ borderColor: `${accent}15` }} />

      {/* Header Block: Rounded elegant slate block with accent highlights */}
      <div className="relative z-10 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 text-white shadow-sm"
           style={{ backgroundColor: accent }}>
        
        {/* Subtle decorative grid/stripes on header background */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,#fff_25%,transparent_25%,transparent_50%,#fff_50%,#fff_75%,transparent_75%,transparent)] bg-[length:20px_20px] pointer-events-none rounded-2xl" />

        <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
          {personalInfo.photo && (
            <div className="w-20 h-20 rounded-xl border-2 border-white/30 shadow-md overflow-hidden shrink-0 flex items-center justify-center bg-white/15">
              <img 
                src={personalInfo.photo} 
                alt={personalInfo.fullName} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-black uppercase tracking-wider">{personalInfo.fullName || 'Your Name'}</h1>
            {personalInfo.jobTitle && (
              <p className="text-xs font-semibold tracking-widest text-amber-300 uppercase mt-1">{personalInfo.jobTitle}</p>
            )}
          </div>
        </div>

        {/* Contact info grid inside the colored header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px] font-medium border-t md:border-t-0 md:border-l border-white/20 pt-4 md:pt-0 md:pl-6 max-w-md w-full shrink-0">
          {personalInfo.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="break-all whitespace-normal text-white">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="break-all whitespace-normal text-white">{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="break-all underline text-white">{personalInfo.website}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-2">
              <Linkedin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="break-all underline text-white">{personalInfo.linkedin}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Body Grid */}
      <div className="relative z-10 grid grid-cols-12 gap-8 items-start">
        {/* Left column (65% width) */}
        <div className="col-span-12 md:col-span-8 flex flex-col gap-6">
          {/* Summary */}
          {personalInfo.summary && (
            <div className="flex flex-col gap-2">
              <h2 className="text-xs font-extrabold uppercase tracking-widest border-b pb-1.5 flex items-center gap-2" style={{ color: accent, borderColor: `${accent}25` }}>
                <span className="w-2 h-2 rounded bg-amber-500" />
                Executive Summary
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                {personalInfo.summary}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {workExperience && workExperience.length > 0 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xs font-extrabold uppercase tracking-widest border-b pb-1.5 flex items-center gap-2" style={{ color: accent, borderColor: `${accent}25` }}>
                <span className="w-2 h-2 rounded bg-amber-500" />
                Professional Journey
              </h2>
              <div className="flex flex-col gap-5">
                {workExperience.map((exp) => (
                  <div key={exp.id} className="page-break-avoid flex flex-col gap-1 relative pl-4 border-l-2" style={{ borderColor: `${accent}15` }}>
                    {/* Bullet marker */}
                    <div className="absolute -left-1.5 top-1.5 w-2.5 h-2.5 rounded-full bg-amber-500" />
                    
                    <div className="flex justify-between items-baseline flex-wrap gap-x-2">
                      <h3 className="text-base font-bold text-slate-900">{exp.position}</h3>
                      <span className="text-xs font-semibold text-slate-500">
                        {formatDate(exp.startDate)} – {formatDate(exp.endDate, exp.current)}
                      </span>
                    </div>
                    
                    <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                      <span>{exp.company}</span>
                      {exp.location && (
                        <>
                          <span>•</span>
                          <span>{exp.location}</span>
                        </>
                      )}
                    </div>
                    
                    <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-wrap mt-1.5">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xs font-extrabold uppercase tracking-widest border-b pb-1.5 flex items-center gap-2" style={{ color: accent, borderColor: `${accent}25` }}>
                <span className="w-2 h-2 rounded bg-amber-500" />
                Academic Background
              </h2>
              <div className="flex flex-col gap-5">
                {education.map((edu) => (
                  <div key={edu.id} className="page-break-avoid flex flex-col gap-1 relative pl-4 border-l-2" style={{ borderColor: `${accent}15` }}>
                    <div className="absolute -left-1.5 top-1.5 w-2.5 h-2.5 rounded-full bg-amber-500" />
                    
                    <div className="flex justify-between items-baseline flex-wrap gap-x-2">
                      <h3 className="text-base font-bold text-slate-950">{edu.degree}</h3>
                      <span className="text-xs font-semibold text-slate-500">
                        {formatDate(edu.startDate)} – {formatDate(edu.endDate, edu.current)}
                      </span>
                    </div>
                    
                    <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                      <span>{edu.school}</span>
                      {edu.location && (
                        <>
                          <span>•</span>
                          <span>{edu.location}</span>
                        </>
                      )}
                    </div>
                    
                    {edu.description && (
                      <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-wrap mt-1.5">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column (35% width) - Sleek Side Details */}
        <div className="col-span-12 md:col-span-4 flex flex-col gap-6">
          {/* Address info if not in header */}
          {personalInfo.address && (
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 page-break-avoid flex flex-col gap-2">
              <h3 className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5" style={{ color: accent }}>
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                Location
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">{personalInfo.address}</p>
            </div>
          )}

          {/* Skills with elegant background tint tag style */}
          {skills && skills.length > 0 && (
            <div className="flex flex-col gap-2.5 page-break-avoid">
              <h2 className="text-xs font-extrabold uppercase tracking-widest border-b pb-1.5 flex items-center gap-2" style={{ color: accent, borderColor: `${accent}25` }}>
                <span className="w-2 h-2 rounded bg-amber-500" />
                Skills Portfolio
              </h2>
              <div className="flex flex-wrap gap-2 pt-1">
                {skills.map((skill, index) => (
                  <span key={index} className="text-xs font-medium px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div className="flex flex-col gap-2.5 page-break-avoid">
              <h2 className="text-xs font-extrabold uppercase tracking-widest border-b pb-1.5 flex items-center gap-2" style={{ color: accent, borderColor: `${accent}25` }}>
                <span className="w-2 h-2 rounded bg-amber-500" />
                Languages
              </h2>
              <div className="flex flex-col gap-2 pt-1">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between items-center text-xs pb-1.5 border-b border-dashed border-slate-100">
                    <span className="font-semibold text-slate-700">{lang.name}</span>
                    <span className="text-[10px] uppercase font-bold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: accent }}>
                      {lang.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

// --- 8. ACADEMIC & PROFESSIONAL TEMPLATE (Matching User Requested Image Format) ---
export function AcademicTemplate({ data }: CVTemplateProps) {
  const { personalInfo, workExperience, education, skills, leadership, achievements, references, customSections, metadata } = data;
  const accent = metadata.accentColor || '#0284c7';
  const fontScale = getFontScaleNumber(metadata.fontSize);
  const sectionOrder = getEffectiveSectionOrder(data);
  const hiddenSections = data.hiddenSections || [];

  // Helper for Section Heading with Accent Title & Solid Line on Right
  const SectionHeader = ({ title }: { title: string }) => (
    <div className="flex items-center gap-3 mt-3 mb-2 page-break-avoid">
      <h2 className="text-base font-bold shrink-0 tracking-tight" style={{ color: accent }}>
        {title}
      </h2>
      <div className="h-[1.5px] bg-slate-800 flex-1"></div>
    </div>
  );

  return (
    <div 
      className="font-sans text-slate-900 bg-white min-h-[297mm] p-8 md:p-10 flex flex-col gap-2.5" 
      style={{ zoom: fontScale / 100, fontSize: `${fontScale}%` }}
    >
      {/* Centered Header with Top-Right Photo */}
      <div className="relative pb-2">
        <div className="text-center px-10">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-1">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.address && (
            <p className="text-xs font-medium text-slate-700 leading-snug">
              {personalInfo.address}
            </p>
          )}
          <div className="text-xs text-slate-700 flex items-center justify-center gap-2 flex-wrap mt-0.5 font-medium">
            {personalInfo.phone && <span>({personalInfo.phone})</span>}
            {personalInfo.phone && personalInfo.email && <span>•</span>}
            {personalInfo.email && <span>Email: {personalInfo.email}</span>}
            {personalInfo.website && <span>• {personalInfo.website}</span>}
          </div>
        </div>

        {/* Circular photo positioned in top right if photo provided */}
        {personalInfo.photo && (
          <div className="absolute top-0 right-0 w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-slate-200 shadow-sm shrink-0">
            <img 
              src={personalInfo.photo} 
              alt={personalInfo.fullName} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
          </div>
        )}
      </div>

      {/* Dynamic Sections rendering in order */}
      {sectionOrder.map((secId) => {
        if (hiddenSections.includes(secId)) return null;

        if (secId === 'summary' && personalInfo.summary) {
          return (
            <div key="summary">
              <SectionHeader title="Professional Statement" />
              <p className="text-xs md:text-[0.825rem] text-slate-800 leading-relaxed text-justify whitespace-pre-wrap">
                {personalInfo.summary}
              </p>
            </div>
          );
        }

        if (secId === 'education' && education && education.length > 0) {
          return (
            <div key="education">
              <SectionHeader title="Education" />
              <div className="flex flex-col gap-2">
                {education.map((edu) => (
                  <div key={edu.id} className="flex flex-col gap-0.5 page-break-avoid">
                    <div className="flex justify-between items-baseline text-xs md:text-[0.825rem] gap-2">
                      <div className="font-medium text-slate-900 flex-1">
                        <span className="font-bold">{edu.school}</span>
                        {edu.degree && <span>, {edu.degree}</span>}
                      </div>
                      <div className="text-center text-slate-700 font-medium whitespace-nowrap shrink-0 min-w-[80px]">
                        {formatDate(edu.startDate)} {edu.startDate && edu.endDate ? '-' : ''} {formatDate(edu.endDate, edu.current)}
                      </div>
                      <div className="text-right font-semibold shrink-0 min-w-[70px]" style={{ color: accent }}>
                        {edu.location || ''}
                      </div>
                    </div>
                    {edu.description && (
                      <p className="text-[11px] text-slate-600 pl-1 mt-0.5">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        }

        if (secId === 'workExperience' && workExperience && workExperience.length > 0) {
          return (
            <div key="workExperience">
              <SectionHeader title="Professional Experience" />
              <div className="flex flex-col gap-3">
                {workExperience.map((exp) => (
                  <div key={exp.id} className="page-break-avoid">
                    <div className="flex justify-between items-baseline flex-wrap gap-1">
                      <div>
                        <h3 className="font-bold text-slate-900 text-xs md:text-sm">{exp.company}</h3>
                        <p className="font-semibold text-slate-700 text-xs">{exp.position}</p>
                      </div>
                      <div className="text-right text-xs font-medium" style={{ color: accent }}>
                        <div>{exp.location}</div>
                        <div>{formatDate(exp.startDate)} - {formatDate(exp.endDate, exp.current)}</div>
                      </div>
                    </div>
                    {exp.description && (
                      <ul className="list-disc pl-5 text-xs text-slate-800 space-y-1 mt-1 leading-relaxed">
                        {exp.description.split('\n').map((line, i) => {
                          const cleanLine = line.replace(/^[•\-\*]\s*/, '').trim();
                          if (!cleanLine) return null;
                          return <li key={i}>{cleanLine}</li>;
                        })}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        }

        if (secId === 'leadership' && leadership && leadership.length > 0) {
          return (
            <div key="leadership">
              <SectionHeader title="Leadership and Volunteering Experience" />
              <div className="flex flex-col gap-3">
                {leadership.map((lead) => (
                  <div key={lead.id} className="page-break-avoid">
                    <div className="flex justify-between items-baseline flex-wrap gap-1">
                      <div>
                        <h3 className="font-bold text-slate-900 text-xs md:text-sm">{lead.company}</h3>
                        <p className="font-semibold text-slate-700 text-xs">{lead.position}</p>
                      </div>
                      <div className="text-right text-xs font-medium" style={{ color: accent }}>
                        <div>{lead.location}</div>
                        <div>{formatDate(lead.startDate)} - {formatDate(lead.endDate, lead.current)}</div>
                      </div>
                    </div>
                    {lead.description && (
                      <ul className="list-disc pl-5 text-xs text-slate-800 space-y-1 mt-1 leading-relaxed">
                        {lead.description.split('\n').map((line, i) => {
                          const cleanLine = line.replace(/^[•\-\*]\s*/, '').trim();
                          if (!cleanLine) return null;
                          return <li key={i}>{cleanLine}</li>;
                        })}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        }

        if (secId === 'achievements' && achievements && achievements.length > 0) {
          return (
            <div key="achievements">
              <SectionHeader title="Achievements" />
              <div className="flex flex-col gap-2 text-xs text-slate-800 leading-relaxed">
                {achievements.map((ach) => (
                  <div key={ach.id} className="page-break-avoid">
                    <p>
                      <span className="font-semibold text-slate-900">{ach.title}</span>
                      {ach.description ? `: ${ach.description}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        if (secId === 'skills' && skills && skills.length > 0) {
          return (
            <div key="skills">
              <SectionHeader title="Skills" />
              <div className="text-xs text-slate-800 flex items-baseline gap-4 page-break-avoid">
                <span className="font-bold text-slate-900 shrink-0">General Skills</span>
                <span>{skills.join(', ')}</span>
              </div>
            </div>
          );
        }

        if (secId === 'languages' && data.languages && data.languages.length > 0) {
          return (
            <div key="languages">
              <SectionHeader title="Languages" />
              <div className="text-xs text-slate-800 flex items-baseline gap-4 page-break-avoid">
                <span className="font-bold text-slate-900 shrink-0">Languages Known</span>
                <span>{data.languages.map(l => `${l.name} (${l.level})`).join(', ')}</span>
              </div>
            </div>
          );
        }

        if (secId === 'references' && references && references.length > 0) {
          return (
            <div key="references">
              <SectionHeader title="Reference" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-800">
                {references.map((ref) => (
                  <div key={ref.id} className="page-break-avoid flex flex-col gap-0.5">
                    <p className="font-bold text-slate-900">{ref.name}</p>
                    <p className="text-slate-700">{ref.title}{ref.organization ? `, ${ref.organization}` : ''}</p>
                    {ref.phone && <p className="text-slate-700">Mobile: {ref.phone}</p>}
                    {ref.email && <p className="text-slate-700">Email: {ref.email}</p>}
                  </div>
                ))}
              </div>
            </div>
          );
        }

        if (secId.startsWith('custom-')) {
          const custom = (customSections || []).find(c => c.id === secId);
          if (!custom || !custom.items || custom.items.length === 0) return null;

          return (
            <div key={secId}>
              <SectionHeader title={custom.title} />
              <div className="flex flex-col gap-3">
                {custom.items.map((item) => (
                  <div key={item.id} className="page-break-avoid">
                    <div className="flex justify-between items-baseline flex-wrap gap-1">
                      <div>
                        <h3 className="font-bold text-slate-900 text-xs md:text-sm">{item.title}</h3>
                        {item.subtitle && <p className="font-semibold text-slate-700 text-xs">{item.subtitle}</p>}
                      </div>
                      {item.date && (
                        <div className="text-right text-xs font-medium" style={{ color: accent }}>
                          {item.date}
                        </div>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-slate-800 mt-1 leading-relaxed whitespace-pre-wrap">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        }

        return null;
      })}

    </div>
  );
}

// Master wrapper that switches based on templateId
export default function CVTemplate({ data }: CVTemplateProps) {
  const { templateId } = data.metadata;
  
  switch (templateId) {
    case 'academic':
      return <AcademicTemplate data={data} />;
    case 'modern':
      return <ModernTemplate data={data} />;
    case 'creative':
      return <CreativeTemplate data={data} />;
    case 'editorial':
      return <EditorialTemplate data={data} />;
    case 'tech':
      return <TechTemplate data={data} />;
    case 'vibrant':
      return <VibrantTemplate data={data} />;
    case 'elegant':
      return <ElegantTemplate data={data} />;
    case 'classic':
    default:
      return <ClassicTemplate data={data} />;
  }
}
