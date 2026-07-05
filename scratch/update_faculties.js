const fs = require('fs');

const extractData = JSON.parse(fs.readFileSync('scratch/faculty_extract.json', 'utf8'));

// Nitya V Arnold
const nityaData = {
  id: 'nitya-v-arnold',
  slug: 'nitya-v-arnold',
  name: 'Mrs. Nitya V Arnold',
  designation: 'Assistant Professor',
  department_id: 'civil',
  email: '',
  image_url: '/Faculty/Final/Mrs.Nitya V Arnold.jpg',
  departments: {
    name: 'Civil Engineering',
    slug: 'civil'
  },
  profile_data: {
    academicQualifications: [
      { degree: 'M.Tech in Civil Engineering', institution: '', year: '' }
    ],
    areasOfExpertise: [
      'Construction Management and Engineering'
    ],
    academicProjects: {
      btechProjects: ['Design and Analysis of a Steel Dome Auditorium'],
      mtechThesis: ['Cost Analysis of a Building Using MATLAB']
    },
    researchInterests: [
      'Water Resources Engineering',
      'Environmental Engineering'
    ],
    technicalSkills: [
      'Construction Planning and Management',
      'Building Cost Estimation and Analysis',
      'MATLAB Applications in Civil Engineering',
      'Structural Analysis and Design',
      'Water Resources and Environmental Engineering',
      'Engineering Drawing',
      'Civil Engineering Software Applications'
    ],
    teachingExperience: '15 Years Teaching Experience in Civil Engineering',
    industryExperience: '6 Months Industrial Experience at KINFRA',
    administrativeResponsibilities: {
      college: [
        'Assistant Camp Officer – KTU Valuation Camp',
        'Faculty Convenor – Alumni Association',
        'Student Mentoring',
        'Project Guidance',
        'Academic & Department Activities',
        'Institutional Development',
        'Technical Events',
        'Workshops',
        'Seminars',
        'Outreach Programmes'
      ]
    }
  }
};
fs.writeFileSync('src/data/faculty/nitya-v-arnold.ts', `import { Faculty } from "@/types/faculty";\n\nexport const nityavarnoldData: Faculty = ${JSON.stringify(nityaData, null, 2)};\n`);

// Beno Ben B P
const benoData = {
  id: 'beno-ben-b-p',
  slug: 'beno-ben-b-p',
  name: 'Beno Ben B P',
  designation: 'Assistant Professor',
  department_id: 'eee',
  email: '',
  image_url: '/Faculty/Final/Mr. Beno Ben.jpg',
  departments: {
    name: 'Electrical & Electronics Engineering',
    slug: 'eee'
  },
  profile_data: {
    academicQualifications: [
      { degree: 'M.E Control & Instrumentation', institution: '', year: '' },
      { degree: 'B.E Electrical & Electronics Engineering', institution: '', year: '' },
      { degree: 'Diploma in Electrical & Electronics Engineering', institution: '', year: '' },
      { degree: 'M.Sc Psychology', institution: '', year: '' }
    ],
    areasOfExpertise: [
      'Control and Instrumentation'
    ],
    academicProjects: {
      btechProjects: ['VLSI Design of 16-Bit Processor Using VHDL'],
      mtechThesis: ['Fuzzy Logic Based Load Frequency Control of Interconnected Power System']
    },
    publications: {
      journalPapers: [
        { title: 'Multiregion Object Segmentation Methods – A Survey', journal: 'International Journal of Scientific Engineering and Technology', year: '' }
      ]
    },
    technicalSkills: ['C', 'C++', 'Java', 'MATLAB'],
    certifications: [
      'AI on Computer Vision',
      'Energy Management & Audit',
      'Recent Trends in Power Electronics & Drives',
      'Artificial Intelligence FDP',
      'Sustainable Engineering',
      'Energy Conservation & Management',
      'Drone Technology',
      'NPTEL – Fuzzy Sets Logic and Systems',
      'Appreciation Certificate for Paper Presentation'
    ],
    awards: [
      'Certificate of Appreciation - Department of Factories and Boilers, Government of Kerala (March 2023)'
    ],
    teachingExperienceDetails: [
      { designation: 'Assistant Professor', institution: 'John Cox Memorial CSIIT', duration: '14 Years' },
      { designation: 'Assistant Professor', institution: 'Immanual Arasar JJ College', duration: '2 Years' },
      { designation: 'Assistant Professor', institution: 'James College of Engineering', duration: '1 Year' }
    ]
  }
};
fs.writeFileSync('src/data/faculty/beno-ben-b-p.ts', `import { Faculty } from "@/types/faculty";\n\nexport const benobenbpData: Faculty = ${JSON.stringify(benoData, null, 2)};\n`);

// For Sarika B.C. and Seena M K, we need to extract from extractData
const getFacultyText = (nameSnippet) => extractData.find(d => d.file.includes(nameSnippet))?.text || '';

const sarikaText = getFacultyText('Sarika');
const seenaText = getFacultyText('Seena');

const sarikaIntroMatch = sarikaText.match(/PROFESSIONAL INTRODUCTION([\s\S]*?)EDUCATIONAL QUALIFICATIONS/i);
const sarikaIntro = sarikaIntroMatch ? sarikaIntroMatch[1].trim() : 'Highly motivated and dedicated Computer Science Educator with 15 years of experience...';

const sarikaData = {
  id: 'sarika-b-c',
  slug: 'sarika-b-c',
  name: 'Sarika B.C.',
  designation: 'Assistant Professor',
  department_id: 'cse',
  email: '',
  image_url: '/Faculty/Final/Ms. Sarika B C.jpg',
  departments: {
    name: 'Computer Science & Engineering',
    slug: 'cse'
  },
  profile_data: {
    biography: sarikaIntro,
    academicQualifications: [
      { degree: 'Master of Engineering (Computer Science)', institution: '', year: '' },
      { degree: 'Bachelor of Technology (Information Technology)', institution: '', year: '' }
    ],
    teachingExperience: '15 Years',
    teachingExperienceDetails: [
      { designation: 'Assistant Professor', institution: 'John Cox Memorial CSIIT', duration: '' },
      { designation: 'Assistant Professor', institution: 'IGNOU', duration: '' },
      { designation: 'Assistant Professor', institution: 'MG College of Engineering', duration: '' },
      { designation: 'Assistant Professor', institution: 'Command IT Solutions', duration: '' }
    ],
    academicProjects: {
      btechProjects: ['VPN Security for Remote Digital Evidence Acquisition'],
      mtechThesis: ['Agent Guilt Model for Preventing Data Leakage']
    },
    technicalSkills: ['C', 'C++', 'Python'],
    areasOfInterest: [
      'Data Structures',
      'Computer Networks',
      'Software Project Management',
      'Operating Systems'
    ],
    administrativeResponsibilities: {
      college: [
        'Staff Advisor',
        'Website Coordinator'
      ]
    },
    achievements: [
      'Consultant – Ernst & Young',
      'Anna University Rank Holder',
      'MS Office Certification',
      'Advanced Java J2EE Certification'
    ],
    workshops: [
      'Latex',
      'Systems Engineering',
      'Image Processing',
      'Ethical Hacking',
      'Amateur Radio Communications',
      'International Conference Paper Presentation'
    ]
  }
};
fs.writeFileSync('src/data/faculty/sarika-b-c.ts', `import { Faculty } from "@/types/faculty";\n\nexport const sarikabcData: Faculty = ${JSON.stringify(sarikaData, null, 2)};\n`);

// Seena M K extraction
const seenaObjMatch = seenaText.match(/OBJECTIVE([\s\S]*?)ACADEMIC QUALIFICATIONS/i);
const seenaObjective = seenaObjMatch ? seenaObjMatch[1].trim() : '';

const seenaData = {
  id: 'seena-m-k',
  slug: 'seena-m-k',
  name: 'Seena M K',
  designation: 'Assistant Professor',
  department_id: 'ece',
  email: '',
  image_url: '/Faculty/Final/Mrs. Seena M K.jpg',
  departments: {
    name: 'Electronics & Communication Engineering',
    slug: 'ece'
  },
  profile_data: {
    careerObjective: seenaObjective,
    academicQualifications: [
      { degree: 'M.E Applied Electronics', institution: '', year: '' },
      { degree: 'MHRM', institution: '', year: '' },
      { degree: 'B.Tech Electronics & Instrumentation', institution: '', year: '' }
    ],
    achievements: [
      '100% University Results',
      'Guided 20+ Projects',
      'University Question Paper Setter',
      'University Question Paper Scrutinizer'
    ],
    technicalSkills: {
      platforms: ['DOS', 'Windows'],
      languages: ['C', 'C++'],
      software: ['MATLAB', 'Xilinx']
    },
    teachingExperienceDetails: [
      { designation: 'Assistant Professor', institution: 'John Cox Memorial CSI Institute of Technology, Thiruvananthapuram', duration: 'June 2011 to Present' },
      { designation: 'Lecturer', institution: 'P A Aziz College of Engineering & Technology, Thiruvananthapuram', duration: 'Jan 2011 to May 2011' },
      { designation: 'Lecturer', institution: 'CSI Institute of Technology, Thovalai, Nagercoil', duration: 'May 2005 to Sep 2006' }
    ],
    academicProjects: {
      pgProjects: [
        'Gradient Descent Biomedical Image Compression',
        'Work Life Balance Study'
      ],
      ugProjects: [
        'Digital Code Locking System',
        'Power Monitoring System'
      ]
    },
    fdps: [
      'National Workshop on Graphical System Design using LabVIEW at Mohandas College of Engineering and Technology (22-24 Feb 2012)',
      'FDP on Mathematics for Machine Learning (APJ Abdul Kalam Technological University, 30 Jun - 16 Jul 2021)',
      'National Level Five Days Online Workshop on \"Real World Applications of Machine Learning\" (NITK Surathkal, 22-26 Feb 2022)',
      '3-day FDP on \"Linear Algebra and its Applications\" (TEQIP II, LBS Institute of Technology for Women, 11-13 Apr 2022)',
      'Webinar on Soft Computing Techniques (Viswajyothi College of Engineering and Technology, 8 Apr 2022)',
      'Webinar on Application of Vector Spaces in Engineering (John Cox Memorial CSI IT, 21 Apr 2022)',
      'One Week AICTE-VTU Joint Teachers Training Programme on \"Robotics & Artificial Intelligence\" (VTU Human Resource Development Centre, 24-28 Apr 2023)',
      'FDP on Research Methodology, Ethics & Publication (John Cox Memorial CSI IT, 28-29 Aug 2024)',
      'International FDP on Machine Learning Applications using Python (Adikavi Nannaya University, 23-27 Sep 2024)'
    ],
    professionalMemberships: [
      'ISTE',
      'RIOS'
    ],
    publications: {
      journalPapers: [
        { title: 'Improved Power and Area Efficient High Speed VLSI Architecture for Advanced Encryption Standard', journal: 'IRJET', year: '2023' },
        { title: 'Wireless Sensor Network to Maximize Crop Yield', journal: 'IJARESM', year: '2023' },
        { title: 'Li-Fi Based Multi Application Assistive System for the Blind', journal: 'IJRASET', year: '2023' }
      ]
    },
    administrativeResponsibilities: {
      college: [
        'College Council Convener',
        'Industry Institute Interaction Cell',
        'Placement Coordinator',
        'Department Convener',
        'Staff Advisor',
        'Exam Cell',
        'Anti Ragging',
        'Admission Committee',
        'Program Assessment',
        'Sports Council',
        'Internal Complaints Committee',
        'Anti Narcotic Cell',
        'University Valuation',
        'Syllabus Committee',
        'External Examiner',
        'Internal Examiner'
      ]
    },
    dateOfBirth: '30-05-1983',
    languages: 'English, Malayalam, Tamil, Hindi',
    nationality: 'Indian',
    phone: '9446261234',
    email: 'seenamknair@gmail.com'
  }
};
fs.writeFileSync('src/data/faculty/seena-m-k.ts', `import { Faculty } from "@/types/faculty";\n\nexport const seenamkData: Faculty = ${JSON.stringify(seenaData, null, 2)};\n`);
console.log('All files updated');
