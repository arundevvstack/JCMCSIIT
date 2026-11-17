export interface SEOData {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage: string;
}

export interface DepartmentData {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  programme: string;
  vision?: string;
  mission?: string | string[];
  objectives?: string[];
  hod?: {
    name: string;
    message: string;
    image?: string;
  };
  faculty?: unknown[]; // Or define a specific Faculty type later
  labDetails?: string[];
  research?: string[];
  coreAreas?: string[];
  careerOpportunities?: string[];
  studentClubs?: string[];
  association?: string;
  industryPartners?: string[];
  achievements?: string[];
  events?: string[];
  galleryImages?: string[];
  downloads?: string[];
  mous?: { partner: string; date?: string; description: string; image?: string; }[];
  labRules?: { dos: string[]; donts: string[]; };
  eventDetails?: { title: string; date?: string; organizedBy?: string; description: string; images?: string[]; }[];
  downloadLinks?: { label: string; url: string; }[];
  technicalStaff?: { name: string; designation: string; image?: string; qualification?: string; }[];
  associationDetails?: { name: string; title?: string; description: string; logo?: string; posters?: string[]; }[];
  festivals?: { name: string; title?: string; description: string; logo?: string; posters?: string[]; }[];
  toppers?: { name: string; semester?: string; score?: string; rank?: string; batch?: string; }[];
  placementDetails?: { title: string; count?: string; highlights?: string[]; companies?: string[]; image?: string; }[];
  labFacilitiesDetailed?: { name: string; equipment?: string[]; experiments?: string[]; image?: string; description?: string; }[];
  
  // Added for Diploma
  duration?: string;
  eligibility?: string;
  admissionProcess?: {
    title: string;
    steps: { title: string; desc: string }[];
  };
  campusFacilities?: string[];
  higherEducation?: string[];

  contactDetails: {
    email: string;
    phone?: string;
    location: string;
  };
  seo: SEOData;
}
