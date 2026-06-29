import re

with open('src/data/departments.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find the FIRST occurrence of '"ece": {'
idx = content.find('  "ece": {')
if idx != -1:
    content = content[:idx]

rest = """  "ece": {
    id: "ece",
    slug: "ece",
    name: "Department of Electronics & Communication Engineering",
    shortDescription: "Offering quality education in communication engineering, embedded systems, VLSI, and IoT.",
    fullDescription: "The NBA Accredited department offers quality education in communication engineering, embedded systems, VLSI, IoT, automation and advanced electronics with modern laboratory facilities.",
    vision: "To excel in education and research in electronics and communication engineering.",
    mission: "To impart strong theoretical foundation and practical skills.",
    programme: "B.Tech in Electronics & Communication Engineering",
    hod: {
      name: "Head of Department",
      message: "Connecting the world through advanced electronics.",
    },
    faculty: [],
    labDetails: ["VLSI Lab", "Embedded Systems Lab", "Communication Systems Lab"],
    research: ["Wireless Sensor Networks", "Signal Processing"],
    coreAreas: [
      "Communication Systems",
      "Embedded Systems",
      "Microcontrollers",
      "VLSI",
      "Wireless Communication",
      "Signal Processing",
      "IoT"
    ],
    careerOpportunities: [
      "Electronics Engineer",
      "Embedded Engineer",
      "Communication Engineer",
      "VLSI Engineer",
      "IoT Developer",
      "Research Engineer"
    ],
    studentClubs: ["Electronics Club", "IoT Society"],
    association: "ECE Students Association",
    industryPartners: ["Intel", "Texas Instruments"],
    achievements: ["Best IoT Project Award"],
    events: ["Circuit Design Contest", "Tech Symposium"],
    galleryImages: [],
    downloads: ["Syllabus", "Academic Calendar"],
    contactDetails: {
      email: "ece@jcmcsiit.ac.in",
      phone: "+91-XXX-XXX-XXXX",
      location: "Block B, 2nd Floor",
    },
    seo: {
      metaTitle: "Department of Electronics & Communication Engineering | JCMCSIIT",
      metaDescription: "Study ECE at JCMCSIIT.",
      keywords: ["ECE", "Electronics", "Communication", "VLSI"],
      ogImage: "/images/departments/ece-og.jpg",
    }
  },
  "eee": {
    id: "eee",
    slug: "eee",
    name: "Department of Electrical & Electronics Engineering",
    shortDescription: "Providing education in electrical machines, power systems, automation, and renewable energy.",
    fullDescription: "The department provides education in electrical machines, power systems, automation, renewable energy, embedded technologies and industrial electronics through modern laboratories and industry-oriented learning.",
    vision: "To be a premier department in electrical and electronics engineering.",
    mission: "To create electrical engineers with strong technical and analytical skills.",
    programme: "B.Tech in Electrical & Electronics Engineering",
    hod: {
      name: "Head of Department",
      message: "Powering the future with innovation.",
    },
    faculty: [],
    labDetails: ["Power Systems Lab", "Electrical Machines Lab", "Control Systems Lab"],
    research: ["Smart Grids", "Renewable Energy Systems"],
    coreAreas: [
      "Power Systems",
      "Electrical Machines",
      "Power Electronics",
      "Industrial Automation",
      "Renewable Energy",
      "Control Systems"
    ],
    careerOpportunities: [
      "Power Engineer",
      "Automation Engineer",
      "Electrical Design Engineer",
      "Industrial Engineer",
      "Renewable Energy Engineer"
    ],
    studentClubs: ["Energy Club"],
    association: "EEE Students Association",
    industryPartners: ["ABB", "Siemens"],
    achievements: ["Green Energy Award"],
    events: ["Power Tech Symposium", "Energy Audit Workshop"],
    galleryImages: [],
    downloads: ["Syllabus", "Academic Calendar"],
    contactDetails: {
      email: "eee@jcmcsiit.ac.in",
      phone: "+91-XXX-XXX-XXXX",
      location: "Block B, Ground Floor",
    },
    seo: {
      metaTitle: "Department of Electrical & Electronics Engineering | JCMCSIIT",
      metaDescription: "Study EEE at JCMCSIIT.",
      keywords: ["EEE", "Electrical", "Electronics", "Power Systems"],
      ogImage: "/images/departments/eee-og.jpg",
    }
  },
  "mechanical": {
    id: "mechanical",
    slug: "mechanical",
    name: "Department of Mechanical Engineering",
    shortDescription: "Preparing students in manufacturing, CAD/CAM, thermal engineering, robotics, and renewable energy.",
    fullDescription: "The department prepares students in manufacturing, CAD/CAM, thermal engineering, robotics, renewable energy and modern production systems through practical engineering education.",
    vision: "To achieve excellence in mechanical engineering education and research.",
    mission: "To impart quality education and training to meet industrial challenges.",
    programme: "B.Tech in Mechanical Engineering",
    hod: {
      name: "Head of Department",
      message: "Designing the machines of tomorrow.",
    },
    faculty: [],
    labDetails: ["CAD/CAM Lab", "Thermal Engineering Lab", "Fluid Mechanics Lab"],
    research: ["Advanced Manufacturing", "Thermal Systems"],
    coreAreas: [
      "Thermal Engineering",
      "Manufacturing",
      "CAD/CAM",
      "Robotics",
      "Fluid Mechanics",
      "Renewable Energy",
      "Production Engineering"
    ],
    careerOpportunities: [
      "Mechanical Engineer",
      "Design Engineer",
      "Production Engineer",
      "CAD Engineer",
      "Automobile Engineer",
      "Industrial Engineer"
    ],
    studentClubs: ["Robotics Club", "SAE Chapter"],
    association: "Mechanical Engineering Association",
    industryPartners: ["Mahindra & Mahindra", "Bosch"],
    achievements: ["SAE BAJA Finalists"],
    events: ["Auto Expo", "CAD Design Contest"],
    galleryImages: [],
    downloads: ["Syllabus", "Academic Calendar"],
    contactDetails: {
      email: "me@jcmcsiit.ac.in",
      phone: "+91-XXX-XXX-XXXX",
      location: "Block C, 1st Floor",
    },
    seo: {
      metaTitle: "Department of Mechanical Engineering | JCMCSIIT",
      metaDescription: "Study Mechanical Engineering at JCMCSIIT.",
      keywords: ["Mechanical Engineering", "CAD", "CAM", "Manufacturing"],
      ogImage: "/images/departments/mechanical-og.jpg",
    }
  },
  "science-humanities": {
    id: "science-humanities",
    slug: "science-humanities",
    name: "Department of Science & Humanities",
    shortDescription: "Building strong foundations in Mathematics, Physics, Chemistry, English, and Engineering Sciences.",
    fullDescription: "The department builds strong foundations in Mathematics, Physics, Chemistry, English, Communication Skills and Engineering Sciences that prepare students for successful engineering education and professional careers.",
    vision: "To foster scientific temper and humanistic values in engineering students.",
    mission: "To provide a strong foundation in basic sciences and communication skills.",
    programme: "First Year Engineering (Common for all branches)",
    hod: {
      name: "Head of Department",
      message: "Laying the foundation for a successful engineering career.",
    },
    faculty: [],
    labDetails: ["Physics Lab", "Chemistry Lab", "Language Lab"],
    research: ["Applied Mathematics", "Material Science"],
    coreAreas: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "English",
      "Engineering Graphics",
      "Communication Skills"
    ],
    careerOpportunities: [
      "Higher Studies",
      "Research",
      "Teaching",
      "Public Sector",
      "Corporate Communication"
    ],
    studentClubs: ["Science Club", "Literary Club"],
    association: "Science & Humanities Forum",
    industryPartners: [],
    achievements: ["Best Science Project Award"],
    events: ["Science Day", "Literary Fest"],
    galleryImages: [],
    downloads: ["First Year Syllabus", "Academic Calendar"],
    contactDetails: {
      email: "sh@jcmcsiit.ac.in",
      phone: "+91-XXX-XXX-XXXX",
      location: "Block A, Ground Floor",
    },
    seo: {
      metaTitle: "Department of Science & Humanities | JCMCSIIT",
      metaDescription: "Science & Humanities Department at JCMCSIIT.",
      keywords: ["Science", "Humanities", "Physics", "Mathematics"],
      ogImage: "/images/departments/sh-og.jpg",
    }
  },
  "diploma-civil-engineering": {
    id: "diploma-civil",
    slug: "diploma-civil-engineering",
    name: "Diploma in Civil Engineering",
    shortDescription: "Design, planning and construction of buildings, roads, bridges and infrastructure with strong practical exposure.",
    fullDescription: "Design, planning and construction of buildings, roads, bridges and infrastructure with strong practical exposure. The diploma program focuses on building practical engineering skills, innovation, and career readiness in the field of Civil Engineering.",
    programme: "Diploma",
    duration: "3 Years",
    eligibility: "SSLC / 10th Pass",
    admissionProcess: {
      title: "Admission Process",
      steps: [
        { title: "Registration", desc: "Fill out the online application form with basic details." },
        { title: "Document Verification", desc: "Upload necessary academic transcripts and identification securely." },
        { title: "Enrollment", desc: "Fee payment and securing your seat." }
      ]
    },
    campusFacilities: ["Central Library", "Workshops", "Hostel Facilities", "Transportation Services", "Canteen"],
    careerOpportunities: ["Site Engineer", "Draftsman", "Surveyor", "Quality Control Inspector", "Public Works Department (PWD) roles"],
    higherEducation: ["B.Tech in Civil Engineering (Lateral Entry)", "Advanced Diploma in Surveying / CAD"],
    contactDetails: {
      email: "info@jcmcsiit.ac.in",
      phone: "+91 9496981555",
      location: "JCMCSIIT Campus",
    },
    seo: {
      metaTitle: "Diploma in Civil Engineering | JCMCSIIT",
      metaDescription: "AICTE-approved Diploma in Civil Engineering at JCMCSIIT. Focus on practical skills and career readiness.",
      keywords: ["Diploma", "Civil Engineering", "JCMCSIIT Diploma"],
      ogImage: "",
    }
  },
  "diploma-computer-engineering": {
    id: "diploma-computer",
    slug: "diploma-computer-engineering",
    name: "Diploma in Computer Engineering",
    shortDescription: "Programming, software development, networking, cloud computing and AI fundamentals with modern computer laboratories.",
    fullDescription: "Programming, software development, networking, cloud computing and AI fundamentals with modern computer laboratories. The diploma program focuses on building practical engineering skills, innovation, and career readiness in the field of Computer Engineering.",
    programme: "Diploma",
    duration: "3 Years",
    eligibility: "SSLC / 10th Pass",
    admissionProcess: {
      title: "Admission Process",
      steps: [
        { title: "Registration", desc: "Fill out the online application form with basic details." },
        { title: "Document Verification", desc: "Upload necessary academic transcripts and identification securely." },
        { title: "Enrollment", desc: "Fee payment and securing your seat." }
      ]
    },
    campusFacilities: ["Central Library", "Workshops", "Hostel Facilities", "Transportation Services", "Canteen"],
    careerOpportunities: ["Software Developer", "Network Administrator", "Database Assistant", "Web Designer", "IT Support Specialist"],
    higherEducation: ["B.Tech in Computer Science (Lateral Entry)", "Specialized Certifications in AI/Cloud"],
    contactDetails: {
      email: "info@jcmcsiit.ac.in",
      phone: "+91 9496981555",
      location: "JCMCSIIT Campus",
    },
    seo: {
      metaTitle: "Diploma in Computer Engineering | JCMCSIIT",
      metaDescription: "AICTE-approved Diploma in Computer Engineering at JCMCSIIT. Focus on practical skills and career readiness.",
      keywords: ["Diploma", "Computer Engineering", "JCMCSIIT Diploma"],
      ogImage: "",
    }
  },
  "diploma-electronics-communication": {
    id: "diploma-ece",
    slug: "diploma-electronics-communication",
    name: "Diploma in Electronics & Communication",
    shortDescription: "Embedded systems, communication technologies, IoT, microcontrollers and digital electronics.",
    fullDescription: "Embedded systems, communication technologies, IoT, microcontrollers and digital electronics. The diploma program focuses on building practical engineering skills, innovation, and career readiness in Electronics & Communication.",
    programme: "Diploma",
    duration: "3 Years",
    eligibility: "SSLC / 10th Pass",
    admissionProcess: {
      title: "Admission Process",
      steps: [
        { title: "Registration", desc: "Fill out the online application form with basic details." },
        { title: "Document Verification", desc: "Upload necessary academic transcripts and identification securely." },
        { title: "Enrollment", desc: "Fee payment and securing your seat." }
      ]
    },
    campusFacilities: ["Central Library", "Workshops", "Hostel Facilities", "Transportation Services", "Canteen"],
    careerOpportunities: ["Electronics Technician", "Communication Assistant", "IoT Support Staff", "Telecom Technician", "Embedded Systems Assistant"],
    higherEducation: ["B.Tech in ECE (Lateral Entry)", "Advanced Diploma in VLSI / Embedded Systems"],
    contactDetails: {
      email: "info@jcmcsiit.ac.in",
      phone: "+91 9496981555",
      location: "JCMCSIIT Campus",
    },
    seo: {
      metaTitle: "Diploma in Electronics & Communication | JCMCSIIT",
      metaDescription: "AICTE-approved Diploma in ECE at JCMCSIIT. Focus on practical skills and career readiness.",
      keywords: ["Diploma", "ECE", "Electronics", "JCMCSIIT Diploma"],
      ogImage: "",
    }
  },
  "diploma-electrical-engineering": {
    id: "diploma-eee",
    slug: "diploma-electrical-engineering",
    name: "Diploma in Electrical Engineering",
    shortDescription: "Electrical machines, power systems, renewable energy, industrial automation and electrical installations.",
    fullDescription: "Electrical machines, power systems, renewable energy, industrial automation and electrical installations. The diploma program focuses on building practical engineering skills, innovation, and career readiness in Electrical Engineering.",
    programme: "Diploma",
    duration: "3 Years",
    eligibility: "SSLC / 10th Pass",
    admissionProcess: {
      title: "Admission Process",
      steps: [
        { title: "Registration", desc: "Fill out the online application form with basic details." },
        { title: "Document Verification", desc: "Upload necessary academic transcripts and identification securely." },
        { title: "Enrollment", desc: "Fee payment and securing your seat." }
      ]
    },
    campusFacilities: ["Central Library", "Workshops", "Hostel Facilities", "Transportation Services", "Canteen"],
    careerOpportunities: ["Electrical Supervisor", "Maintenance Engineer", "Power Plant Technician", "Automation Assistant", "Electrical Draughtsman"],
    higherEducation: ["B.Tech in EEE (Lateral Entry)", "Advanced Diploma in Industrial Automation"],
    contactDetails: {
      email: "info@jcmcsiit.ac.in",
      phone: "+91 9496981555",
      location: "JCMCSIIT Campus",
    },
    seo: {
      metaTitle: "Diploma in Electrical Engineering | JCMCSIIT",
      metaDescription: "AICTE-approved Diploma in Electrical Engineering at JCMCSIIT. Focus on practical skills and career readiness.",
      keywords: ["Diploma", "Electrical Engineering", "JCMCSIIT Diploma"],
      ogImage: "",
    }
  },
  "diploma-mechanical-engineering": {
    id: "diploma-me",
    slug: "diploma-mechanical-engineering",
    name: "Diploma in Mechanical Engineering",
    shortDescription: "Manufacturing, CAD/CAM, machine design, thermal engineering and industrial production technologies.",
    fullDescription: "Manufacturing, CAD/CAM, machine design, thermal engineering and industrial production technologies. The diploma program focuses on building practical engineering skills, innovation, and career readiness in Mechanical Engineering.",
    programme: "Diploma",
    duration: "3 Years",
    eligibility: "SSLC / 10th Pass",
    admissionProcess: {
      title: "Admission Process",
      steps: [
        { title: "Registration", desc: "Fill out the online application form with basic details." },
        { title: "Document Verification", desc: "Upload necessary academic transcripts and identification securely." },
        { title: "Enrollment", desc: "Fee payment and securing your seat." }
      ]
    },
    campusFacilities: ["Central Library", "Workshops", "Hostel Facilities", "Transportation Services", "Canteen"],
    careerOpportunities: ["Junior Engineer (Mechanical)", "Production Supervisor", "CAD Designer", "Maintenance Technician", "Quality Inspector"],
    higherEducation: ["B.Tech in Mechanical Engineering (Lateral Entry)", "Advanced Certification in CAD/CAM/CAE"],
    contactDetails: {
      email: "info@jcmcsiit.ac.in",
      phone: "+91 9496981555",
      location: "JCMCSIIT Campus",
    },
    seo: {
      metaTitle: "Diploma in Mechanical Engineering | JCMCSIIT",
      metaDescription: "AICTE-approved Diploma in Mechanical Engineering at JCMCSIIT. Focus on practical skills and career readiness.",
      keywords: ["Diploma", "Mechanical Engineering", "JCMCSIIT Diploma"],
      ogImage: "",
    }
  }
};
"""

with open('src/data/departments.ts', 'w', encoding='utf-8') as f:
    f.write(content + rest)
print('Done!')
