export interface FacultyProfileData {
  qualificationTimeline?: Array<{ year: string; degree: string; institution: string }>;
  highestQualification?: string;
  specialization?: string;
  researchInterests?: string[];
  teachingExperience?: string;
  industryExperience?: string;
  professionalExperience?: string;
  projects?: string[];
  publications?: Array<{ title: string; journal: string; year: string; link?: string }>;
  conferencePapers?: string[];
  patents?: string[];
  certifications?: string[];
  fdps?: string[]; // Faculty Development Programmes
  workshops?: string[];
  trainingProgrammes?: string[];
  technicalSkills?: string[];
  professionalMemberships?: string[];
  academicResponsibilities?: string[];
  achievements?: string[];
  awards?: string[];
  currentResponsibilities?: string[];
  languagesKnown?: string[];
  phone?: string;
  officeLocation?: string;
  googleScholar?: string;
  orcid?: string;
  researchGate?: string;
  linkedin?: string;
  [key: string]: any;
}

export interface Faculty {
  id: string;
  department_id: string;
  name: string;
  slug?: string;
  designation?: string;
  email?: string;
  image_url?: string;
  cv_url?: string;
  bio?: string;
  profile_data?: FacultyProfileData;
  created_at?: string;
  updated_at?: string;
  
  // Joined fields if querying with departments
  departments?: {
    name: string;
    slug: string;
  };
}
