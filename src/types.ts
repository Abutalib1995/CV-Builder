export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  linkedin?: string;
  photo?: string; // base64 string
  summary?: string; // professional summary
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  location?: string;
  cgpa?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description?: string;
}

export interface Language {
  id: string;
  name: string;
  level: LanguageLevel;
}

export interface Reference {
  id: string;
  name: string;
  title: string;
  organization?: string;
  phone?: string;
  email?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description?: string;
}

export interface CustomSectionItem {
  id: string;
  title?: string;
  subtitle?: string;
  date?: string;
  description?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface CVData {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: string[];
  languages: Language[];
  leadership?: WorkExperience[];
  achievements?: Achievement[];
  references?: Reference[];
  customSections?: CustomSection[];
  sectionOrder?: string[];
  hiddenSections?: string[];
  sectionTitles?: Record<string, string>;
  metadata: {
    templateId: 'classic' | 'modern' | 'creative' | 'editorial' | 'tech' | 'vibrant' | 'elegant' | 'academic';
    accentColor: string;
    fontSize?: 'sm' | 'base' | 'lg' | number | string;
  };
}

export interface TemplateConfig {
  id: 'classic' | 'modern' | 'creative' | 'editorial' | 'tech' | 'vibrant' | 'elegant' | 'academic';
  name: string;
  description: string;
  containerClass: string;
  headerClass: string;
  sectionTitleClass: string;
}
