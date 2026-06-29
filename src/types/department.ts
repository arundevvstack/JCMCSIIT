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
  mission?: string;
  hod?: {
    name: string;
    message: string;
    image?: string;
  };
  faculty?: any[]; // Or define a specific Faculty type later
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
    phone: string;
    location: string;
  };
  seo: SEOData;
}
