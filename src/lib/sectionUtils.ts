import { CVData, CustomSection } from '../types';

export const STANDARD_SECTION_LABELS: Record<string, { en: string; bn: string }> = {
  summary: { en: 'Personal Summary / Profile', bn: 'ব্যক্তিগত সারসংক্ষেপ ও পরিচিতি' },
  workExperience: { en: 'Work Experience', bn: 'কর্মঅভিজ্ঞতা' },
  education: { en: 'Education & Academic', bn: 'শিক্ষাগত যোগ্যতা' },
  skills: { en: 'Skills & Expertise', bn: 'দক্ষতাসমূহ' },
  languages: { en: 'Languages', bn: 'ভাষাসমূহ' },
  leadership: { en: 'Leadership & Volunteering', bn: 'নেতৃত্ব ও সেবামূলক কাজ' },
  achievements: { en: 'Achievements & Awards', bn: 'অর্জন ও সম্মাননা' },
  references: { en: 'References', bn: 'রেফারেন্স / সুপারিশকারী' }
};

export const CUSTOM_SECTION_PRESETS = [
  { id: 'certifications', title: 'Certifications & Training (সার্টিফিকেট ও ট্রেনিং)' },
  { id: 'publications', title: 'Publications & Research (প্রকাশনা ও গবেষণা)' },
  { id: 'projects', title: 'Key Projects & Portfolio (প্রজেক্ট ও পোর্টফোলিও)' },
  { id: 'honors', title: 'Honors & Awards (পুরস্কার ও সম্মাননা)' },
  { id: 'volunteering', title: 'Volunteering & Community (স্বেচ্ছাসেবী কাজ)' },
  { id: 'hobbies', title: 'Hobbies & Interests (শখ ও আগ্রহ)' },
  { id: 'custom', title: 'Custom Section (নিজের মতো শিরোনাম)' }
];

export function getEffectiveSectionOrder(data: CVData): string[] {
  const defaultOrder = [
    'summary',
    'workExperience',
    'education',
    'skills',
    'languages',
    'leadership',
    'achievements',
    'references'
  ];
  
  const customIds = (data.customSections || []).map(c => c.id);
  const savedOrder = data.sectionOrder && data.sectionOrder.length > 0 ? [...data.sectionOrder] : [...defaultOrder, ...customIds];
  
  const allKnownIds = [...defaultOrder, ...customIds];
  const finalOrder: string[] = [];

  for (const id of savedOrder) {
    if (allKnownIds.includes(id) && !finalOrder.includes(id)) {
      finalOrder.push(id);
    }
  }

  for (const id of allKnownIds) {
    if (!finalOrder.includes(id)) {
      finalOrder.push(id);
    }
  }

  return finalOrder;
}

export function getSectionDisplayTitle(secId: string, data: CVData): string {
  if (data.sectionTitles && data.sectionTitles[secId]?.trim()) {
    return data.sectionTitles[secId].trim();
  }
  if (STANDARD_SECTION_LABELS[secId]) {
    return STANDARD_SECTION_LABELS[secId].en;
  }
  const custom = (data.customSections || []).find(c => c.id === secId);
  if (custom) {
    return custom.title || 'Custom Section';
  }
  return secId;
}
