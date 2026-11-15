export interface PrincipalMessageData {
    heading: string;
    greeting: string;
    openingQuote: string;
    paragraphs: string[];
    closingWish: string;
    principalName: string;
    designation: string;
    institutionName: string;
    additionalRole: string;
    imagePath: string;
    imageAlt: string;
}

export const PRINCIPAL_MESSAGE_CMS_BLOCK_KEY = "principal_message";

export const OFFICIAL_PRINCIPAL_MESSAGE: PrincipalMessageData = {
    heading: "A Message from the Principal",
    greeting: "Dear Students, Faculty, Parents and Well-wishers,",
    openingQuote:
        "“Education is not simply the pursuit of knowledge; it is the preparation of capable, ethical and compassionate individuals who can make a meaningful difference in society.”",
    paragraphs: [
        "It is a privilege to be associated with John Cox Memorial CSI Institute of Technology, an institution inspired by a tradition of education, service and social responsibility. We believe that the purpose of technical education extends beyond classrooms and examinations. It is about nurturing curiosity, strengthening character, encouraging innovation and preparing young people to respond confidently to the challenges of a rapidly changing world.",
        "Our priority is to provide a supportive and stimulating learning environment in which every student is encouraged to discover their strengths, develop professional competence and pursue excellence. Through effective teaching, experiential learning, mentoring, industry interaction, research and innovation, we aim to connect academic knowledge with real-world needs.",
        "As an institution, we will continue to work towards strengthening academic quality, outcome-based education, research culture, institutional effectiveness and continuous improvement. We will encourage our students and faculty to embrace emerging technologies, interdisciplinary thinking, entrepreneurship and lifelong learning while remaining grounded in integrity, inclusiveness, discipline and respect for others.",
        "I firmly believe that an institution grows through the shared commitment of its students, faculty, staff, parents, alumni, industry partners and management. By working together, we can build a vibrant academic community that values achievement, recognises individual potential and creates opportunities for all to progress.",
        "I invite each of you to join us in this journey of learning, service and transformation. Let us work together to make JCMCSIIT a place where ideas are encouraged, talent is nurtured and future-ready professionals are shaped with knowledge, values and purpose.",
    ],
    closingWish:
        "Wishing all our students a rewarding, successful and inspiring academic journey.",
    principalName: "Dr. Kim J. Seelan",
    designation: "Principal",
    institutionName: "John Cox Memorial CSI Institute of Technology",
    additionalRole: "Chairman of John Cox Memorial CSI Institute of Technology",
    imagePath: "/images/principal.jpg",
    imageAlt:
        "Dr. Kim J. Seelan, Principal of John Cox Memorial CSI Institute of Technology.",
};
