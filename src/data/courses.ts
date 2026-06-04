export type CourseDetails = {
  id: string;
  name: string;
  degree: string;
  overview: string;
  vision: string;
  mission: string[];
  peos: string[];
  psos?: string[];
  facilities: string[];
};

export const coursesData: Record<string, CourseDetails> = {
  "aiml": {
    id: "aiml",
    name: "Artificial Intelligence & Machine Learning",
    degree: "B.Tech",
    overview: "Artificial Intelligence and Machine Learning (AI&ML) is an emerging field of engineering that focuses on creating intelligent machines that can simulate human thinking capability and behavior. The Department commenced offering B.Tech Degree in AI&ML, equipping students with a solid foundation in both computer science and advanced AI concepts.",
    vision: "To become a center of excellence in Artificial Intelligence and Machine Learning, fostering innovation, research, and technical leadership to solve real-world problems.",
    mission: [
      "To provide high-quality education in AI and ML with a strong emphasis on foundational concepts and practical applications.",
      "To foster an environment of continuous learning and innovation.",
      "To collaborate with industry and research institutions for curriculum development and real-world projects."
    ],
    peos: [
      "Develop innovative AI solutions for diverse domains.",
      "Engage in lifelong learning and professional growth.",
      "Contribute to societal development with ethical AI practices."
    ],
    facilities: [
      "AI & Deep Learning Lab",
      "High-Performance Computing Center",
      "IoT and Robotics Integration Lab"
    ]
  },
  "cse": {
    id: "cse",
    name: "Computer Science & Engineering",
    degree: "B.Tech",
    overview: "Computer Science and Engineering is the stream of the theoretical foundation of information and computation and of practical techniques for their implementation and application in Computer Systems. The Department commenced in 2009 offering B.Tech Degree in Computer Science and Engineering with an intake of 60 students.",
    vision: "To excel as a hub of knowledge and innovation in computer science and engineering, empowering students and researchers to develop cutting-edge technologies.",
    mission: [
      "Innovative teaching and research that address global challenges.",
      "Development of critical thinking and problem-solving abilities for real-world applications.",
      "Fostering a collaborative environment to contribute to national and global socioeconomic development."
    ],
    peos: [
      "Solve Real-World Problems with Innovation.",
      "Engage in Lifelong Learning and Professional Development.",
      "Contribute to Societal and Economic Development."
    ],
    psos: [
      "Able to apply fundamental principles of computation, science, and engineering.",
      "Demonstrate proficiency in utilizing current software development methodologies.",
      "Capable of applying knowledge of cutting-edge technologies."
    ],
    facilities: [
      "Programming Lab",
      "Networking Lab",
      "DATA BASE Management Systems Lab",
      "Project Lab",
      "Research Lab/CCF"
    ]
  },
  "biomedical-robotic": {
    id: "biomedical-robotic",
    name: "Biomedical & Robotic Engineering",
    degree: "B.Tech",
    overview: "The Department of Biomedical and Robotics Engineering was established in the year 2024 with an intake of 30 students, marking the beginning of an exciting interdisciplinary journey that bridges healthcare innovations with advanced automation and intelligent systems.",
    vision: "To become a globally recognized center of excellence in Biomedical and Robotic Engineering, pioneering transformative healthcare solutions and intelligent automation.",
    mission: [
      "To deliver an industry-aligned curriculum combining biomedical systems, robotics, AI, and mechatronics.",
      "To promote hands-on learning through labs, project-based courses, and internships.",
      "To nurture research, collaboration, and entrepreneurship by encouraging partnerships with healthcare institutions."
    ],
    peos: [
      "Equip students with strong theoretical foundations and practical skills in biomedical engineering.",
      "Develop innovative problem-solving abilities for real-world healthcare challenges.",
      "Promote collaboration with hospitals and industries for joint research."
    ],
    facilities: [
      "Biomedical Instrumentation Lab",
      "Sensors and Signal Processing Lab",
      "Robotics Design and Automation Systems Lab"
    ]
  },
  "ece": {
    id: "ece",
    name: "Electronics and Communication Engineering",
    degree: "B.Tech",
    overview: "Electronics and Communication Engineering is an engineering discipline providing the knowledge on theoretical and practical aspects of different areas. The Department commenced in 2009 offering B.Tech Degree in Electronics & Communication Engineering with an intake of 30 students.",
    vision: "Empowering students to innovate and create sustainable solutions for societal and global challenges.",
    mission: [
      "To nurture a generation of engineers equipped with technical expertise and ethical values.",
      "To establish a vibrant research ecosystem promoting innovation in advanced communication systems.",
      "To create an active learning environment that integrates practical exposure."
    ],
    peos: [
      "Technical Competence in electronics and embedded systems.",
      "Professional Ethics and Leadership in multidisciplinary teams.",
      "Entrepreneurship and Innovation for sustainable solutions."
    ],
    facilities: [
      "Communication Lab",
      "Microwave and Optical Lab",
      "Electronic Circuits Lab",
      "Digital Electronics Lab",
      "Simulation Lab",
      "Project Lab"
    ]
  },
  "mechanical": {
    id: "mechanical",
    name: "Mechanical Engineering",
    degree: "B.Tech",
    overview: "Mechanical Engineering involves the Application of principles of Physics for Analysis, Manufacturing, and Maintenance of Mechanical Systems. The Department commenced in 2009 offering B.Tech Degree in Mechanical Engineering with an intake of 60 students.",
    vision: "To be a center of excellence in Mechanical Engineering education and research, producing globally competent and socially responsible engineers.",
    mission: [
      "To impart quality education with a strong foundation in mechanical engineering principles.",
      "To foster innovation, research, and entrepreneurship.",
      "To instil professional ethics and social responsibility in students."
    ],
    peos: [
      "Apply mechanical engineering knowledge to solve industrial problems.",
      "Engage in continuous learning and professional development.",
      "Exhibit leadership and teamwork in multidisciplinary projects."
    ],
    facilities: [
      "Basic Engineering Workshop",
      "Heat Engines Laboratory (Turbo charged engines, CRDI Engines, MPFI Engines)",
      "CAD/CAM Lab",
      "Fluid Mechanics Lab",
      "Material Testing Lab"
    ]
  },
  "civil": {
    id: "civil",
    name: "Civil Engineering",
    degree: "B.Tech",
    overview: "Civil Engineering is a professional engineering discipline that deals with the design, construction, and maintenance of the physical and naturally built environment. The Department offers a comprehensive B.Tech program aimed at producing industry-ready professionals.",
    vision: "To develop into a premier center of excellence in civil engineering education and research, contributing to sustainable infrastructure development.",
    mission: [
      "To provide high-quality technical education in civil engineering.",
      "To promote research and consultancy activities addressing societal needs.",
      "To foster ethical values and leadership skills among students."
    ],
    peos: [
      "Design and execute civil engineering projects successfully.",
      "Pursue higher education and engage in lifelong learning.",
      "Contribute to sustainable and eco-friendly infrastructure development."
    ],
    facilities: [
      "Surveying Lab",
      "Material Testing Lab",
      "Environmental Engineering Lab",
      "Geotechnical Engineering Lab",
      "Computer Aided Design (CAD) Lab"
    ]
  }
};
