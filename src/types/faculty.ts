export interface AcademicQualification {
  degree: string;
  institution: string;
  university?: string;
  year: string;
  grade?: string;
}

export interface ExperienceTimeline {
  institution?: string;
  company?: string;
  designation?: string;
  role?: string;
  duration: string;
}

export interface TechnicalSkills {
  languages?: string[];
  software?: string[];
  tools?: string[];
  laboratories?: string[];
  platforms?: string[];
}

export interface AcademicProjects {
  ugProjects?: string[];
  pgProjects?: string[];
  btechProjects?: string[];
  mtechThesis?: string[];
  phdResearch?: string[];
  phdTopic?: string[];
  researchProjects?: string[];
}

export interface Publications {
  journalPapers?: Array<{ title: string; journal: string; year: string; link?: string }>;
  conferencePapers?: Array<{ title: string; conference: string; year: string; link?: string }>;
  books?: string[];
  bookChapters?: string[];
  patents?: string[];
}

export interface AdminResponsibilities {
  department?: string[];
  college?: string[];
  university?: string[];
  committees?: string[];
  roles?: string[]; // Coordinator, Lab In-charge, etc.
  placementResponsibilities?: string[];
  labInchargeResponsibilities?: string[];
  staffAdvisorRoles?: string[];
  coordinatorRoles?: string[];
  examCell?: string[];
  nba?: string[];
  naac?: string[];
  iqac?: string[];
  iedc?: string[];
  innovationCell?: string[];
  kdisc?: string[];
  nss?: string[];
}

export interface StudentGuidance {
  ugProjects?: string[];
  pgProjects?: string[];
  researchGuidance?: string[];
  mentoring?: string[];
}

export interface TimelineEvent {
  year?: string;
  title: string;
  description?: string;
}

export interface FacultyProfileData {
  // Hero & Summary
  highestQualification?: string;
  totalExperience?: string;
  officeLocation?: string;
  primarySpecialization?: string;
  biography?: string;
  careerObjective?: string;
  website?: string;

  // Qualifications
  academicQualifications?: AcademicQualification[];

  // Expertise & Interests
  areasOfExpertise?: string[];
  researchInterests?: string[];
  areasOfInterest?: string[];

  // Experience
  teachingExperience?: ExperienceTimeline[] | string | any;
  industryExperience?: ExperienceTimeline[] | string | any;

  // Skills & Subjects
  subjectsHandled?: string[];
  technicalSkills?: TechnicalSkills | string[] | any;

  // Projects & Research
  academicProjects?: AcademicProjects | string[] | any;
  publications?: Publications | any[] | any;
  researchActivities?: string[];

  // Continuous Learning
  fdps?: TimelineEvent[] | string[];
  workshops?: string[];
  seminars?: string[];
  trainingProgrammes?: string[];
  certifications?: string[];
  moocs?: string[];
  nptel?: string[];

  // Memberships & Admin
  professionalMemberships?: string[];
  administrativeResponsibilities?: AdminResponsibilities;

  // Students & Achievements
  studentGuidance?: StudentGuidance;
  awards?: TimelineEvent[] | string[];
  achievements?: TimelineEvent[] | string[];
  rankHolders?: string[];
  paperPresentations?: string[];
  consultancy?: string[];
  extensionActivities?: string[];
  conferences?: string[];

  // Gallery
  galleryImages?: string[];

  // Social & Links
  phone?: string;
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
  slug: string;
  designation?: string;
  email?: string;
  image_url?: string;
  cv_url?: string;
  bio?: string;
  profile_data?: FacultyProfileData;
  created_at?: string;
  updated_at?: string;
  
  departments?: {
    name: string;
    slug: string;
  };
}
