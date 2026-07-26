import { CVData } from './types';

export const INITIAL_CV_DATA: CVData = {
  personalInfo: {
    fullName: 'Alexander Dupont',
    jobTitle: 'Senior Full Stack Developer',
    email: 'alexander.dupont@example.com',
    phone: '+33 6 1234 5678',
    address: 'Paris, France',
    website: 'alexdupont.dev',
    linkedin: 'linkedin.com/in/alexdupont',
    summary: 'Highly analytical and detail-oriented Senior Software Engineer with over 6 years of experience designing, building, and deploying robust full-stack applications. Expert in React, TypeScript, Node.js, and cloud native architectures with a strong track record of optimization and team mentorship.',
    photo: '', // Empty by default, user can upload
  },
  workExperience: [
    {
      id: 'work-1',
      company: 'TechSolutions Paris',
      position: 'Senior Full Stack Engineer',
      location: 'Paris, France',
      startDate: '2023-01',
      endDate: '',
      current: true,
      description: '• Spearheaded migration of a legacy monolithic frontend to React and Vite micro-frontends, reducing initial page load time by 42%.\n• Built and optimized real-time collaborative features using WebSockets and dynamic state synchronization.\n• Mentored 5 junior and mid-level engineers, instituting code review standards and rigorous test-driven development (TDD) methodologies.\n• Designed scalable RESTful APIs in Node.js and Express processing over 50,000 daily requests.'
    },
    {
      id: 'work-2',
      company: 'InnovaCorp Lyon',
      position: 'Software Developer',
      location: 'Lyon, France',
      startDate: '2020-09',
      endDate: '2022-12',
      current: false,
      description: '• Developed responsive, interactive data visualization dashboards using React, Tailwind CSS, and D3.js.\n• Collaborated closely with UI/UX designers to implement a modern design system, improving user satisfaction scores by 15%.\n• Maintained database integrity by optimizing complex SQL queries in PostgreSQL, reducing average query execution time by 25%.\n• Integrated multiple third-party payment gateways (Stripe) and OAuth authentication providers securely.'
    }
  ],
  education: [
    {
      id: 'edu-1',
      school: 'Sorbonne University',
      degree: 'Master of Science in Computer Science',
      location: 'Paris, France',
      startDate: '2018-09',
      endDate: '2020-06',
      current: false,
      description: 'Specialization in Software Engineering and Distributed Systems. Graduated with Honors (Top 5% of class).'
    },
    {
      id: 'edu-2',
      school: 'University of Lyon',
      degree: 'Bachelor of Science in Information Technology',
      location: 'Lyon, France',
      startDate: '2015-09',
      endDate: '2018-06',
      current: false,
      description: 'Core foundation in algorithms, databases, discrete mathematics, and networking architectures.'
    }
  ],
  skills: [
    'React', 'TypeScript', 'Node.js', 'Express', 'Tailwind CSS', 'PostgreSQL', 
    'Docker', 'AWS', 'Git', 'D3.js', 'REST APIs', 'Agile / Scrum'
  ],
  languages: [
    { id: 'lang-1', name: 'French', level: 'C2' },
    { id: 'lang-2', name: 'English', level: 'C1' },
    { id: 'lang-3', name: 'Spanish', level: 'B1' }
  ],
  leadership: [
    {
      id: 'lead-1',
      company: 'University Research & Science Club',
      position: 'Event Coordinator & Volunteer Lead',
      location: 'Paris, France',
      startDate: '2022-01',
      endDate: '2023-05',
      current: false,
      description: '• Helped to organize and coordinate inter-school science fairs, ensuring smooth event flow and logistics.\n• Facilitated student mentorship sessions and collaborative team building activities.'
    }
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'Co-authored Academic Research Paper & Best Project Award',
      description: 'Co-authored a research paper on distributed cloud architectures. Awarded 1st place in sorbonne Annual Tech Olympiad.'
    }
  ],
  references: [
    {
      id: 'ref-1',
      name: 'Dr. Jean-Pierre Laurent',
      title: 'Professor & Department Head',
      organization: 'Sorbonne University, Faculty of Computer Science',
      phone: '+33 1 4427 4000',
      email: 'jp.laurent@sorbonne.fr'
    },
    {
      id: 'ref-2',
      name: 'Claire Dupont',
      title: 'Engineering Director',
      organization: 'TechSolutions Paris',
      phone: '+33 1 5530 2100',
      email: 'claire.dupont@techsolutions.fr'
    }
  ],
  customSections: [
    {
      id: 'custom-certifications',
      title: 'Certifications & Training (সার্টিফিকেট ও ট্রেনিং)',
      items: [
        {
          id: 'cert-1',
          title: 'AWS Certified Solutions Architect – Associate',
          subtitle: 'Amazon Web Services (AWS)',
          date: '2023',
          description: 'Validation of technical expertise in designing and deploying cloud-native architectures.'
        }
      ]
    }
  ],
  sectionOrder: [
    'summary',
    'workExperience',
    'education',
    'skills',
    'languages',
    'leadership',
    'custom-certifications',
    'achievements',
    'references'
  ],
  hiddenSections: [],
  metadata: {
    templateId: 'academic',
    accentColor: '#0284c7', // Academic Sky Blue
    fontSize: 'base'
  }
};

export const CEFR_LEVELS = [
  { level: 'A1', label: 'A1 - Beginner' },
  { level: 'A2', label: 'A2 - Elementary' },
  { level: 'B1', label: 'B1 - Intermediate' },
  { level: 'B2', label: 'B2 - Upper Intermediate' },
  { level: 'C1', label: 'C1 - Advanced' },
  { level: 'C2', label: 'C2 - Proficient / Native' }
] as const;

export const ACCENT_COLORS = [
  { name: 'Academic Sky', value: '#0284c7' },  // Bright Academic Blue
  { name: 'Europass Blue', value: '#1e3a8a' }, // Deep Blue
  { name: 'Emerald', value: '#047857' },       // Teal/Green
  { name: 'Swiss Slate', value: '#374151' },     // Gray
  { name: 'Royal Crimson', value: '#991b1b' },   // Red/Burgundy
  { name: 'Parisian Plum', value: '#581c87' },   // Purple
  { name: 'Amber Glow', value: '#b45309' }       // Warm Amber
];
