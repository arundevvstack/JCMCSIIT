const fs = require('fs');

// 1. ABISHA RAJ D S
const abishaData = {
  id: 'abisha-raj-d-s',
  slug: 'abisha-raj-d-s',
  name: 'Abisha Raj D S',
  designation: 'Lecturer',
  department_id: 'cse',
  email: '',
  image_url: '/Faculty/Final/ABISHA RAJ D S profile.jpg', // Guessed based on pattern, will just use whatever exists or generic
  departments: { name: 'Computer Science & Engineering', slug: 'cse' },
  profile_data: {
    academicQualifications: [{ degree: 'B.E Computer Science and Engineering', institution: '', year: '' }],
    areasOfExpertise: ['Programming', 'Front End Web Development'],
    academicProjects: { btechProjects: ['Enhanced Small Drone Detection Using Optimized CNN with Attention Mechanisms'] },
    publications: { journalPapers: [{ title: 'Merging Thoughts with Technology, The Neuralink Concept', journal: '', year: '' }] },
    certifications: ['Python Full Stack Web Development', 'Diploma in Computer Application (DCA)'],
    technicalSkills: ['Python Programming', 'HTML', 'CSS', 'React.js']
  }
};
fs.writeFileSync('src/data/faculty/abisha-raj-d-s.ts', `import { Faculty } from "@/types/faculty";\n\nexport const abisharajdsData: Faculty = ${JSON.stringify(abishaData, null, 2)};\n`);

// 2. ANJANA S. P.
const anjanaData = {
  id: 'anjana-s-p',
  slug: 'anjana-s-p',
  name: 'Anjana S. P.',
  designation: 'Assistant Professor',
  department_id: 'eee',
  email: '',
  image_url: '/Faculty/Final/ANJANA S. P..jpg',
  departments: { name: 'Electrical & Electronics Engineering', slug: 'eee' },
  profile_data: {
    academicQualifications: [
      { degree: 'M.Tech in Power and Energy Engineering', institution: 'Amrita Viswavidyapeetham University, Amritapuri campus', year: '2015-2017' },
      { degree: 'B.Tech in Electrical and Electronics Engineering', institution: 'NSS College of Engineering, Palakkad', year: '2010-2014' },
      { degree: 'Higher Secondary Education', institution: 'Govt. Girls Higher Secondary School, Neyyattinkara', year: '2010' },
      { degree: 'SSLC', institution: 'St. Chrysostoms’ Girls Higher Secondary School, Nellimoodu', year: '2008' }
    ],
    publications: {
      journalPapers: [{ title: 'Intelligent Demand Side Management for Residential Users in a Smart Micro-Grid', journal: 'IEEE International Conference on Technological Advancements in Power and Energy (TAP Energy 2017)', year: '2017' }]
    },
    workshops: [
      'Workshop on Lifeskills by HRDC of APJ Abdul Kalam Technological University at CET, Trivandrum.',
      'Participated in IP Awareness/ training program under National Intellectual Property Awareness Mission on 18 February 2023.',
      'Attended Webinar on Electric Vehicles and Charging Infrastructure by JCMCSIIT.',
      'National workshop on Electric Power Quality in association with IEEE PES in NIT Calicut.',
      'National workshop on Power Electronics and control of Modern Electrical drives organized by Dept. of EEE, Amrita Vishwa Vidhyapeetham, Coimbatore.'
    ],
    fdps: [
      'Smart Energy systems for Future Grids by Carmel college of Engineering and Technology, Alappuzha.',
      'Green Energy Solutions: Building a Sustainable, Carbon- Neutral World at College of Engineering Muttathara by ATAL Academy.',
      'Vehicle Electrification: Future Mobility Trends at Sahrdaya College of Engineering and Technology by ATAL Academy.',
      'Generative AI and Prompt Engineering by 360 DigiTMG India in association with ASAP Kerala.',
      'Oppurtunities of Power Electronics in Smart Grid, Renewable Energy Resources and Electric Vehicles by SCMS School of Engineering and Technology.',
      'Research Perspectives in Energy, Enviornment & Conservation by SCMS School of Engineering and Technology.',
      'Robotics: Control and Applications-Phase1,organized by Mar Baselious College of Engineering and Technology, Tvm.',
      'Recent & Future Research Trends in Non-Conventional Energy Sources, College of Engineering, Pathanapuram.',
      'Role of Energy storage systems in Microgrid and Electric Vechicles, organized by TKM College of Engineering, Kollam.'
    ],
    areasOfInterest: ['Power Systems', 'Renewable Energy Systems', 'Smart Grid Technologies', 'Electrical Machines'],
    awards: [
      'Appreciation Award for securing 100% results in S8 B.Tech 2025-26 examination.',
      'Mentor under the Talent Accelerator Programme (TAP) of K-DISC.',
      'Presented a paper on “Demand Side Management for Residential Users in a Smart Micro-Grid” at IEEE - International Conference On Telecommunication, Power Analysis And Computing Techniques (ICTPACT – 2017).',
      'Syllabus setter of the subject Power System Protection of Diploma in Electrical Engineering of 2026 Curriculam revision by DTE.'
    ],
    teachingExperienceDetails: [
      { designation: 'Assistant Professor', institution: 'John Cox CSI Institute of Technology Kannamoola, Thiruvananthapuram', duration: 'August 2018 to till date' },
      { designation: 'ACD Guest Instructor', institution: 'Govt. ITI , SCDD Kanjiramkulam', duration: 'April 2015- July 2015' }
    ],
    academicProjects: {
      mtechThesis: ['DEMAND SIDE MANAGEMENT FOR RESIDENTIAL USERS IN A SMART MICRO-GRID. A DSM algorithm uses load shifting techniques with the Time of Use energy billing scheme for residential users to reduce their electricity bill as well as peak energy consumption is proposed and simulated in MATLAB software. Also design and develop a hardware prototype of Demand Side Management system.'],
      btechProjects: ['POWER LINE COMMUNICATION BASED HOME ENERGY MANAGEMENT SYSTEM. The project is designed to develop a Home Energy Management System that can provide easy to access information on home energy consumption in real time and intelligent control on appliances.']
    },
    personalSkills: ['Strong managerial and organisational skills', 'Good teaching skills', 'Good inter-personnel and communication skills', 'Responsible and Adaptive', 'Patience', 'Good listener']
  }
};
fs.writeFileSync('src/data/faculty/anjana-s-p.ts', `import { Faculty } from "@/types/faculty";\n\nexport const anjanaspData: Faculty = ${JSON.stringify(anjanaData, null, 2)};\n`);

// 3. Anu R John
const anuData = {
  id: 'anu-r-john',
  slug: 'anu-r-john',
  name: 'Anu R John',
  designation: 'Assistant Professor',
  department_id: 'eee',
  email: 'getanu02@gmail.com',
  phone: '9207661376',
  image_url: '/Faculty/Final/Anu R John.jpg',
  departments: { name: 'Electrical & Electronics Engineering', slug: 'eee' },
  profile_data: {
    careerObjective: 'To contribute effectively to the field of Engineering through excellence in teaching, research, and mentoring. I aim to inspire students to achieve academic and professional success while continuously enhancing my knowledge and skills, fostering innovation, and supporting the institution\'s mission of academic excellence and societal development.',
    academicQualifications: [
      { degree: 'M.E in Power Electronics and Drives', institution: 'Anna University', year: '' },
      { degree: 'B.E in Electrical and Electronics Engineering', institution: 'Anna University', year: '' }
    ],
    areasOfExpertise: ['Power Electronics and Drives'],
    teachingExperienceDetails: [
      { designation: 'Assistant Professor', institution: 'John Cox Memorial CSI Institute of Technology', duration: 'April 2014-present' },
      { designation: 'Guest Lecturer', institution: 'John Cox Memorial CSI Institute of Technology', duration: 'March 2013- March 2014' }
    ],
    academicProjects: {
      btechProjects: ['Analysis and Mitigation of faults in STATCOM for power system stability enhancement'],
      mtechThesis: ['Mitigation of Torsional vibration of PM Brushless DC Drive with Direct Torque controller']
    },
    technicalSkills: { languages: ['C', 'MATLAB', 'PSCAD'] },
    areasOfInterest: ['Power electronics', 'Power system', 'Electrical Machines and Design', 'Digital Electronics', 'Control system', 'Electric Vehicle'],
    administrativeResponsibilities: {
      college: [
        'Department Placement co ordinator (2019-2022)',
        'Worked as Placement officer at John Cox Memorial CSI Institute of Technology (2022-2023)',
        'Valuation camp Chairman(S1,S2)(2022-present)',
        'KDISC-KTU courses college co-ordinator',
        'PAC Department Convener',
        'Working as Assistant Placement officer at John Cox Memorial CSI Institute of Technology(2023- present)'
      ]
    },
    publications: {
      conferencePapers: [
        { title: 'Mitigation of Torsional vibration of PM Brushless DC Drive with Direct Torque controller', conference: 'International conference on Emerging trends in electrical engineering, March 21st and 22nd 2013', year: '2013' },
        { title: 'Mitigation of Torsional vibration of PM Brushless DC Drive with Direct Torque controller', conference: 'International conference on Electrical and Energy systems,2013', year: '2013' }
      ]
    },
    achievements: [
      'Twenty first rank in M.E at Anna University in Power Electronics and Drives',
      'Eighteenth Rank in B.E at Anna University in Electrical and Electronics Engineering'
    ],
    certifications: [
      'Participated and completed two day international conference on “Emerging Trends in Electrical Engineering” March 2013',
      'Participated and completed three day seminar on Energy conversation in JIT',
      'Participated and completed JIT Faculty Development Programme 2014',
      'Participated and completed five day KTU Conducted Faculty Development Programme on “Essentials on Engineering Mathematics” in association with ICT from 29.11.2016 to 3.12.2016',
      'Participated and completed five day Faculty Development Programme on “Power Electronic control in Renewable energy applications” at Vimal Jyothi Engineering college from 25.4.2022 to 29.4.2022',
      'Participated and completed five day Faculty Development Programme on “Robotics-Control and Applications I” at MBCET from 4.4.2022 to 8.4.2022',
      'Participated and completed KTU sponsored five day Faculty Development Programme on “Recent and Future trends on Conventional Energy Sources” at College of Engineering, Pathanapuram from6.9.2023 to 10.9.2023',
      'Participated and completed six day Faculty Development Programme on “Artificial Intelligence in Electric Vehicle” at College of Engineering,Perumon from 2.12.2024 to 7.12.2024',
      'Participated and completed 24 days Faculty Development Programme on “Generative AI and Prompt Engineering” 360DigiTMG,India Association with ASAP from 9.12.2024 to 24.12.2024',
      'Participated and completed five day Faculty Development Programme on “EV Technology” at HIEE Empowering Engineers from 3.5.2025',
      'Participated and completed five day AICTE-ATAL Faculty Development Programme on “Green Energy Solutions: Building a sustainable, Carbon Neutral world” at College of Engineering, Muttathara from 13.1.2025 to 18.1.2025',
      'Participated and completed five day AICTE-ATAL Faculty Development Programme on “Vehicle Electrification: Future Mobility Trends” at Sahrdaya college of Engineering and Technology from 27.1.2025 to 1.2.2025',
      'Participated and completed Gen Al Generated International Webinar on “Cloud and DevOps” Organised by IPSR solutions limited and Valin Technology on 11.1.2025',
      'Participated and completed five day Faculty Development Programme on “Reasearch Article writing using LaTex and Biomedical Research:Current trends and Application” from 13.6.2025 to 18.6.2025',
      'Attended a Seminar on “Harnessing AI to improve and Measure Learning outcome beyond Compliance”',
      'Participated and completed AICTE-ATAL Faculty Development Programme on “Advances in Electric Vehicles and sustainable energy systems: Strategies, AI Applications, and Future Directions” at Amritha Viswa Vidyapeetham from 15.9.2025 to 20.9.2025',
      'Participated and completed AICTE-ATAL Faculty Development Programme on “Reneweable Energy systems and Grid Integration: Technologies, Challenges and solutions” at MEA Engineering college,Perinthalmanna from 15.9.2025 to 20.9.2025',
      'Participated and completed AICTE-ATAL Faculty Development Programme on “Next Generation Semiconductor Technologies: Design, Materials and Applications” at Vimal Jyothi Engineering college, Perinthalmanna from 27.10.2025 to 1.11.2025',
      'Participated and completed three day Faculty Development Programme on “Agile Innovation ,Design Thinking and Generative AI organized” by IEDC and Nest Digital Academy at Ahalia School of Engineering and Technology from 17.11.2025 to 19.11.2025',
      'Participated and completed five day Faculty Development Programme on “Smart Energy Systems for Future Grids: Emerging Research in Power Electronics, Intelligent control and Cyber secure Networks” at Carmel College of Engineering and Technology from 20.4.2026 to 24.4.2026',
      'Participated and completed five day Faculty Development Programme on “Next Generation AI: LLMs, Agentic and Multi Agent Systems” at Baselios Mathews II College of Engineering from 27.4.2026 to 1.5.2026',
      'Participated and completed five day National level Faculty Development Programme on “Research Methodology and Academic Writing in the Digital Age” organized by AMIEE Assocation and CMAOI Association from 18.5.2026 to 22.5.2026'
    ]
  }
};
fs.writeFileSync('src/data/faculty/anu-r-john.ts', `import { Faculty } from "@/types/faculty";\n\nexport const anurjohnData: Faculty = ${JSON.stringify(anuData, null, 2)};\n`);

// 4. ARATHIRAJ B S
const arathiData = {
  id: 'arathiraj-b-s',
  slug: 'arathiraj-b-s',
  name: 'Arathiraj B S',
  designation: 'Assistant Professor',
  department_id: 'ece',
  email: 'arathirajbs2025@gmail.com',
  phone: '9447728585',
  image_url: '/Faculty/Final/ARATHIRAJ B S.jpg',
  departments: { name: 'Electronics & Communication Engineering', slug: 'ece' },
  profile_data: {
    academicQualifications: [
      { degree: 'M.E. in Applied Electronics', institution: '', year: '' },
      { degree: 'B. Tech in Electronics & Communication Engineering', institution: '', year: '' }
    ],
    academicProjects: { mtechThesis: ['Structural Quality Evaluation of Geometrically Distorted Images in Digital Image Processing. Project focusing on analysis of local geometric distortion of an image with the reference images and geometrically corrected using Gabour filters.'] },
    areasOfExpertise: ['Applied Electronics', 'VLSI Design', 'Control Systems', 'Communication Engineering', 'Network Theory', 'Image Processing'],
    technicalSkills: ['VLSI Design Concepts', 'Electronic Circuit Design and Analysis', 'Communication Systems', 'Control System Engineering', 'Network Analysis', 'Signal and Image Processing', 'Engineering Education and Outcome-Based Learning', 'Innovation and Entrepreneurship Development'],
    certifications: ['NPTEL Online Certification: The MOS Transistor Modeling (12 week courses)/ January-April 2026'],
    teachingExperience: 'Teaching Experience (Over 14 Years)',
    teachingExperienceDetails: [
      { designation: 'Assistant Professor', institution: 'Johncox Memorial CSI IT, Kannammoola', duration: '' },
      { designation: 'Assistant Professor', institution: 'Muslim Association College of Engineering, Venjarammoodu', duration: '' },
      { designation: 'Lecturer', institution: 'SIVAJI College of Engineering and Technology', duration: '' }
    ],
    administrativeResponsibilities: {
      university: [
        'University Assignments: KTU Valuation Chairman, University Observer , University Paper Valuator and Revaluator for both Kerala University (KU) and APJ Abdul Kalam Technological University (KTU), and External/Internal Lab Examiner.'
      ],
      college: [
        'Event Coordination: Arts fest Coordinator, Technical event co-ordinator for the ECE Department Technical Fest (JIT IGNIUM), K-DISC mentor of ECE Department.'
      ]
    },
    professionalMemberships: [
      'Institution\'s Innovation Council (IIC) – President',
      'Active participant in professional development programmes conducted by academic and professional bodies.'
    ],
    awards: [
      'Approved Patent for the innovative project titled “Wearable Disaster Emergency Communication Device.”',
      'Active contributor to innovation, entrepreneurship, and quality assurance initiatives within the institution.'
    ],
    fdps: [
      '6-Day FDP on Digital & Biomedical Signal Processing Tools, Trends and Research Impact, organized by the Department of Electronics & Communication Biomedical Engineering, ICET, May 2026',
      'Exploring AI Paradigms: Machine Learning, Deep Learning and Research Perspectives, March 2025',
      'Design Thinking for Innovation and Entrepreneurship, ATAL Academy, February 2025',
      'Virtual International Conference by Raman International Optronics, November 2024',
      'IPR Awareness Programme, CUSAT RUSA 2.0, February 2024',
      'Industry 5.0 FDP, IETE Thiruvananthapuram, August 2022',
      'Faculty Development Programme (FDP) at JIT, October–November 2014',
      'Recent Trends in Nanotechnology – Short-Term Training Programme, College of Engineering Trivandrum, December 2012',
      'New Parameters in Teaching & Learning – A Paradigm Shift, January 2012',
      'National Conference on Communication, VLSI & Signal Processing, April 2011'
    ]
  }
};
fs.writeFileSync('src/data/faculty/arathiraj-b-s.ts', `import { Faculty } from "@/types/faculty";\n\nexport const arathirajbsData: Faculty = ${JSON.stringify(arathiData, null, 2)};\n`);

// 5. ARATHY KRISHNAN
const arathyData = {
  id: 'arathy-krishnan',
  slug: 'arathy-krishnan',
  name: 'Arathy Krishnan',
  designation: 'Assistant Professor',
  department_id: 'civil',
  email: '',
  image_url: '/Faculty/Final/ARATHY KRISHNAN.jpg',
  departments: { name: 'Civil Engineering', slug: 'civil' },
  profile_data: {
    academicQualifications: [
      { degree: 'PG Degree: Geotechnical Engineering', institution: 'Kalam Technical university', year: '2017-2019' },
      { degree: 'Degree: Civil Engineering', institution: 'CUSAT', year: '2013-2017' }
    ],
    areasOfExpertise: ['Geotechnical Engineering'],
    academicProjects: {
      mtechThesis: ['Landslide susceptibility mapping using TRIGRS and Rainfall effects in slopes'],
      btechProjects: ['Thiruvananthapuram Medical college Traffic decongestion plan'],
      internships: ['Habitat Technology group, Poojapura, Thiruvananthapuram', 'PWD Building Sub Division, Nedumangad']
    },
    publications: {
      journalPapers: [{ title: 'Analyszing the effect of eco-DRR practices on slope stability in a landslide-prone transport corridor in the Western Ghats,India', journal: 'Int. j. Disast. Studies Climate Resil, 2025, 1(1):35-46', year: '2025' }],
      conferencePapers: [
        { title: 'Thiruvananthapuram Medical college Traffic decongesion plan', conference: 'Thiruvananthapuram Medical college', year: '2017' },
        { title: 'Study on reduction of Permeability in Field soil using clay', conference: 'International Conference on Innovative Trends in Science and Technology (ICITST 2018), Sarabhai Institute of Science and Technology', year: '2018' },
        { title: 'Landslide susceptibility mapping of Ponmudi-Kallar region using TRIGRS', conference: 'International Conference on Recent Scientific Research in Engineering and Technology, John cox Memorial CSI Institute of Technology(JIT)', year: '2019' }
      ]
    },
    teachingExperience: '6 YEARS AND 10 MONTHS'
  }
};
fs.writeFileSync('src/data/faculty/arathy-krishnan.ts', `import { Faculty } from "@/types/faculty";\n\nexport const arathykrishnanData: Faculty = ${JSON.stringify(arathyData, null, 2)};\n`);

// 6. SWAPNA V
const swapnaData = {
  id: 'swapna-v',
  slug: 'swapna-v',
  name: 'Swapna V',
  designation: 'Assistant Professor',
  department_id: 'civil',
  email: 'swapnawilfred@gmail.com',
  image_url: '/Faculty/Final/SWAPNA V.jpg',
  departments: { name: 'Civil Engineering', slug: 'civil' },
  profile_data: {
    biography: 'Deep passion for teaching and innovation in civil infrastructure. Actively involved in guiding undergraduate students through core subjects such as Structural Analysis, Reinforced concrete Design, Design of Steel Structures and Strength Of Materials. Committed to both academic excellence and professional development.',
    academicQualifications: [
      { degree: 'BTech in Civil Engineering', institution: '', year: '' },
      { degree: 'ME in Structural Engineering', institution: '', year: '' }
    ],
    areasOfExpertise: ['Structural Engineering'],
    administrativeResponsibilities: {
      college: [
        'Teaching subjects Design of Steel Structures and Disaster Management',
        'Faculty in charge of Geotechnical Engineering Lab',
        'Staff Advisor of S7 CE(2022-2026 batch)'
      ]
    }
  }
};
fs.writeFileSync('src/data/faculty/swapna-v.ts', `import { Faculty } from "@/types/faculty";\n\nexport const swapnavData: Faculty = ${JSON.stringify(swapnaData, null, 2)};\n`);

console.log('All remaining files updated.');
