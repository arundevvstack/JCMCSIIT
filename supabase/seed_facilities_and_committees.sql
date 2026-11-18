-- ============================================================================
-- JCMC SIIT CMS — Phase 14 & 15 Idempotent Seed Script
-- File: supabase/seed_facilities_and_committees.sql
-- Description: Registers all 8 Facilities and 16 Campus Life / Committee routes
--              into public.pages and populates baseline structured content blocks
--              into public.content_blocks.
-- Safety: Strictly non-destructive. Uses ON CONFLICT DO NOTHING throughout.
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. FACILITIES PAGES (public.pages) — 8 Core Campus Facilities
-- ----------------------------------------------------------------------------
INSERT INTO public.pages (
  id, slug, route_path, title, subtitle, summary, content, status, integration_status, is_published, updated_at
) VALUES
(
  'e0000014-0000-0000-0000-000000000001'::uuid,
  'facilities-campus',
  '/facilities/campus',
  'Campus Infrastructure & Environment',
  'A vibrant 25-acre green academic environment fostering technological innovation and holistic student growth.',
  'Overview of JCMC SIIT campus infrastructure, academic blocks, Wi-Fi connectivity, and lush green environment.',
  '## Campus Infrastructure Overview

John Cox Memorial CSI Institute of Technology (JCMC SIIT) is nestled in a lush, eco-friendly green campus at Kannammoola, Thiruvananthapuram. The campus provides a modern, serene, and academically stimulating atmosphere equipped with cutting-edge laboratories, multimedia lecture halls, extensive recreational areas, and round-the-clock security surveillance.

### Key Campus Highlights
- **Spacious Academic Blocks**: Architecturally planned ventilated classrooms equipped with smart projectors and digital audio systems.
- **Green Campus Initiative**: Tree-lined walkways, botanical gardens, and solar power installations promoting sustainability.
- **High-Speed Connectivity**: Seamless Wi-Fi coverage across all academic departments, libraries, and common areas.
- **Safety & Surveillance**: Comprehensive 24/7 CCTV monitoring, trained security personnel, and well-lit campus pathways.',
  'published',
  'connected',
  true,
  NOW()
),
(
  'e0000014-0000-0000-0000-000000000002'::uuid,
  'facilities-canteen',
  '/facilities/canteen',
  'Campus Canteen & Cafeteria',
  'Hygienic, nutritious, and affordable multi-cuisine dining facilities for students, faculty, and campus visitors.',
  'Information regarding campus dining, hygiene standards, operating hours, and nutritional meal options.',
  '## Dining at JCMC SIIT

The college operates a spacious, clean, and well-maintained cafeteria catering to the culinary preferences of our diverse student body and faculty members. 

### Highlights & Facilities
- **Hygienic Food Preparation**: Modern kitchen equipment following strict FSSAI food safety and sanitation protocols.
- **Nutritious & Affordable**: Wholesome breakfast, traditional Kerala lunches, fresh fruit juices, and evening snacks at student-friendly prices.
- **Dedicated Seating**: Ample seating capacity allowing comfortable dining during peak break hours.
- **Filtered Water Stations**: UV-purified RO drinking water dispensers installed across the dining hall.',
  'published',
  'connected',
  true,
  NOW()
),
(
  'e0000014-0000-0000-0000-000000000003'::uuid,
  'facilities-conference-hall',
  '/facilities/conference-hall',
  'Auditorium & Conference Halls',
  'Acoustically treated venues equipped with state-of-the-art audiovisual systems for national seminars and cultural events.',
  'Details of institutional seminar halls, auditorium capacity, AV capabilities, and corporate presentation spaces.',
  '## Seminar Halls & Conference Facilities

JCMC SIIT houses an air-conditioned central auditorium and multiple departmental seminar halls designed for hosting international symposiums, technical paper presentations, faculty development programs, and collegiate cultural meets.

### Features
- **Acoustic Design**: Professionally sound-engineered auditoriums with premium surround sound and feedback cancellation.
- **Digital Projection**: High-lumen digital projectors, motorized screens, and video conferencing capabilities for remote guest lectures.
- **Seating Capacity**: Central auditorium seats 500+ attendees comfortably with ergonomic theater-style seating.',
  'published',
  'connected',
  true,
  NOW()
),
(
  'e0000014-0000-0000-0000-000000000004'::uuid,
  'facilities-hostel',
  '/facilities/hostel',
  'Hostel Facilities',
  'Comfortable, secure, and well-connected accommodation for our students at the historic LMS Compound, Palayam.',
  'Safe residential hostels for boys and girls with study rooms, Wi-Fi, and dedicated warden care.',
  '## A Home Away From Home

Hostel accommodation for both boys and girls is provided in a safe and supportive residential environment situated in the LMS Compound, Palayam. The hostels offer well-ventilated rooms, disciplined study hours, balanced meals, and reliable security supervision.',
  'published',
  'connected',
  true,
  NOW()
),
(
  'e0000014-0000-0000-0000-000000000005'::uuid,
  'facilities-internet-lab',
  '/facilities/internet-lab',
  'Central Computing & Internet Lab',
  'Advanced computing infrastructure with dedicated gigabit leased lines, high-performance workstations, and AI tools.',
  'High-speed computing laboratory accessible for research, programming contests, and digital coursework.',
  '## Advanced Computing Infrastructure

The Central Computing Centre at JCMC SIIT serves as the primary digital backbone for computational research, software development, online certification examinations, and academic coursework.

### Infrastructure Highlights
- **High-Speed Leased Line**: Redundant high-bandwidth fiber optic internet connection ensuring 99.9% uptime.
- **Modern Hardware**: Enterprise-grade Intel/AMD multi-core workstations configured with dual-boot Linux and Windows OS.
- **Development Suites**: Pre-installed developer toolchains for Python, Java, C++, MATLAB, Android SDK, and Machine Learning frameworks.',
  'published',
  'connected',
  true,
  NOW()
),
(
  'e0000014-0000-0000-0000-000000000006'::uuid,
  'facilities-library',
  '/facilities/library',
  'Central Library & Information Centre',
  'A modern gateway to knowledge offering over 25,000+ volumes, 500+ e-journals, and 24/7 digital resource access.',
  'Central repository of academic textbooks, research papers, digital portals, and quiet reading zones.',
  '## Central Library & Digital Information Hub

The Central Library of JCMC SIIT is an automated knowledge resource center catering to the instructional and research needs of undergraduate, postgraduate, and faculty researchers. Fully automated with Koha integrated library management software.',
  'published',
  'connected',
  true,
  NOW()
),
(
  'e0000014-0000-0000-0000-000000000007'::uuid,
  'facilities-transportation',
  '/facilities/transportation',
  'Campus Transportation & Fleet',
  'A dedicated fleet of college buses providing safe, comfortable, and punctual transit across Thiruvananthapuram and suburbs.',
  'Institutional bus routes, pickup points, safety guidelines, and transport officer contact information.',
  '## Safe & Reliable Commute

The institution operates a fleet of modern, GPS-enabled buses connecting prime residential sectors of Thiruvananthapuram city, Neyyattinkara, Attingal, Nedumangad, and suburbs directly to the Kannammoola campus.',
  'published',
  'connected',
  true,
  NOW()
),
(
  'e0000014-0000-0000-0000-000000000008'::uuid,
  'facilities-workshop',
  '/facilities/workshop',
  'Central Engineering Workshops',
  'Comprehensive hands-on training facilities equipped with industrial lathes, foundry, welding, and carpentry units.',
  'Basic engineering workshop introducing students to manufacturing, fabrication, and machine tool operations.',
  '## Practical Engineering Foundations

The Central Workshop introduces first-year engineering students to the fundamentals of manufacturing technology and industrial production processes.

### Workshop Divisions
- **Machine Shop**: Heavy-duty industrial lathes, shaping machines, milling cutters, and precision drilling machinery.
- **Fitting & Assembly**: Hand tools, bench vices, precision vernier calipers, and metal-shaping workbenches.
- **Welding & Fabrication**: Shielded metal arc welding, gas welding apparatus, and protective safety apparel.
- **Carpentry & Foundry**: Woodworking lathes, pattern-making tools, sand molding benches, and casting furnaces.',
  'published',
  'connected',
  true,
  NOW()
)
ON CONFLICT (route_path) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 2. CAMPUS LIFE & COMMITTEES PAGES (public.pages) — 16 Routes
-- ----------------------------------------------------------------------------
INSERT INTO public.pages (
  id, slug, route_path, title, subtitle, summary, content, status, integration_status, is_published, updated_at
) VALUES
(
  'e0000015-0000-0000-0000-000000000001'::uuid,
  'campus-life-overview',
  '/campus-life',
  'Campus Life & Student Experience',
  'Empowering student communities through vibrant cultural forums, technical clubs, leadership councils, and athletic teams.',
  'Portal to collegiate life, co-curricular societies, athletic meets, and creative student associations.',
  '## Life at John Cox Memorial CSI Institute of Technology

Campus life at JCMC SIIT extends beyond lecture rooms into dynamic cultural clubs, technical project societies, community outreach missions, and inter-collegiate competitions that nurture confident, ethical leaders.',
  'published',
  'connected',
  true,
  NOW()
),
(
  'e0000015-0000-0000-0000-000000000002'::uuid,
  'campus-life-alumni',
  '/campus-life/alumni',
  'Alumni Network',
  'A global brotherhood of 2000+ engineering graduates driving tech innovation, executive leadership, and entrepreneurship.',
  'Connecting alumni across 20+ nations with campus mentorship, placement referrals, and annual reunions.',
  '## Our Global Alumni Community

Our alumni represent JCMC SIIT across various sectors including leading multinational technology companies, government organizations, research institutions, and successful entrepreneurial ventures.',
  'published',
  'connected',
  true,
  NOW()
),
(
  'e0000015-0000-0000-0000-000000000003'::uuid,
  'campus-life-nss',
  '/campus-life/nss',
  'National Service Scheme (NSS)',
  'Fostering social responsibility, community development, and leadership through selfless community service.',
  'NSS Unit 245 conducting health camps, blood donation drives, environmental cleanups, and literacy programs.',
  '## Not Me, But You — NSS Unit 245

The National Service Scheme unit at JCMC SIIT actively involves youth in nation-building activities, disaster relief campaigns, tree plantation drives, and village adoption welfare programs.',
  'published',
  'connected',
  true,
  NOW()
),
(
  'e0000015-0000-0000-0000-000000000004'::uuid,
  'student-support-sports',
  '/campus-life/student-support/sports',
  'Physical Education & Athletics',
  'Cultivating physical fitness, sporting excellence, team camaraderie, and collegiate athletic leadership.',
  'Outdoor playgrounds, indoor badminton courts, cricket nets, and inter-collegiate tournament training.',
  '## Department of Physical Education

JCMC SIIT emphasizes balanced student development through active physical education, athletics, and collegiate sports leagues.

### Sports Infrastructure
- **Multipurpose Ground**: Facilities for cricket, football, volleyball, and track events.
- **Indoor Games Centre**: Table tennis, chess, carrom, and badminton courts with evening practice sessions.
- **Annual Sports Meet**: College-wide sports meet featuring track, field, and house team championships.',
  'published',
  'connected',
  true,
  NOW()
),
(
  'e0000015-0000-0000-0000-000000000005'::uuid,
  'arts-committee',
  '/campus-life/student-support/arts-committee',
  'Arts & Cultural Committee',
  'Celebrating creative expression, artistic talent, stage arts, music, dance, and collegiate festivals.',
  'Orchestrating the annual arts festival, literary competitions, theater plays, and musical band performances.',
  '## Celebrating Artistic Creativity

The Arts Committee coordinates cultural celebrations, youth festivals, and talent discovery events across engineering batches.

### Flagship Cultural Activities
- **Annual Arts Fest**: Multi-day collegiate competition in classical dance, mime, light music, debating, and painting.
- **Festival Celebrations**: Traditional Onam, Christmas, and college foundation day pageants with community feasts.
- **Music & Drama Club**: Student music bands and drama troupes representing JCMC SIIT at university festivals.',
  'published',
  'connected',
  true,
  NOW()
),
(
  'e0000015-0000-0000-0000-000000000006'::uuid,
  'students-council',
  '/campus-life/student-support/students-council',
  'College Students Council',
  'The official elected student body voicing student perspectives and championing campus welfare initiatives.',
  'Student council leadership structure, democratic representation, and academic collaboration.',
  '## Democratic Student Representation

The Students Council serves as the recognized conduit between the student community and college administration, fostering constructive dialog, campus welfare, and ethical governance.',
  'published',
  'connected',
  true,
  NOW()
),
(
  'e0000015-0000-0000-0000-000000000007'::uuid,
  'clubs-alumni',
  '/campus-life/student-support/clubs/alumni',
  'Alumni Association Chapter',
  'Nurturing lifelong relationships between graduating engineers and their alma mater through alumni chapters.',
  'Alumni engagement portal, mentorship programs, guest lectures, and institutional support initiatives.',
  '## JCMC SIIT Alumni Chapter

The Alumni Association Chapter facilitates career guidance for current students, sponsored scholarships, and technical workshops conducted by accomplished alumni working worldwide.',
  'published',
  'connected',
  true,
  NOW()
),
(
  'e0000015-0000-0000-0000-000000000008'::uuid,
  'grievance-icc',
  '/campus-life/student-support/grievance/icc',
  'Internal Complaints Committee (ICC)',
  'Upholding gender equity, dignity, and a zero-tolerance framework against sexual harassment on campus.',
  'Statutory committee constituted in compliance with the PoSH Act 2013 and AICTE regulations.',
  '## Internal Complaints Committee (ICC)

Constituted in strict compliance with the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013, and AICTE regulations to ensure a safe, supportive, and dignified working and learning atmosphere.',
  'published',
  'connected',
  true,
  NOW()
),
(
  'e0000015-0000-0000-0000-000000000009'::uuid,
  'grievance-sgrc',
  '/campus-life/student-support/grievance/sgrc',
  'Student Grievance Redressal Committee (SGRC)',
  'A transparent, impartial, and confidential mechanism for resolving academic and campus life grievances.',
  'Statutory body addressing student concerns, academic fairness, and institutional support.',
  '## Student Grievance Redressal Committee

The SGRC provides an accessible, fair, and confidential grievance adjudication mechanism for all enrolled undergraduate and diploma students.',
  'published',
  'connected',
  true,
  NOW()
),
(
  'e0000015-0000-0000-0000-000000000010'::uuid,
  'grievance-online',
  '/campus-life/student-support/grievance/online',
  'Online Grievance Submission Portal',
  'Confidential digital grievance filing system with secure tracking and prompt administrative escalation.',
  'Direct online channel for registering complaints, suggestions, and academic inquiries securely.',
  '## Digital Grievance Portal

Students and parents can submit confidential grievances, requests, or constructive suggestions directly to institutional monitoring authorities via this online channel.',
  'published',
  'connected',
  true,
  NOW()
),
(
  'e0000015-0000-0000-0000-000000000011'::uuid,
  'cells-ieee',
  '/cells/ieee',
  'IEEE Student Branch & Societies',
  'World-class professional technical societies fostering research, automation, robotics, and women in engineering.',
  'IEEE SB JCMCSIIT featuring Robotics & Automation (RAS), Systems & Systems (SAS), and WIE Affinity Groups.',
  '## IEEE Student Branch (STB64571)

IEEE Student Branch JCMC SIIT empowers engineering students to access global technical conferences, international competitions, publication networks, and hands-on robotics workshops.',
  'published',
  'connected',
  true,
  NOW()
),
(
  'e0000015-0000-0000-0000-000000000012'::uuid,
  'cells-iedc',
  '/cells/iedc',
  'Innovation & Entrepreneurship Development Centre (IEDC)',
  'Igniting entrepreneurial thinking, startup incubation, patent drafting, and student business ideas.',
  'Kerala Startup Mission supported cell fostering student innovators, hackathons, and seed grants.',
  '## Innovation & Entrepreneurship Development Centre

Operating under Kerala Startup Mission (KSUM), the IEDC at JCMC SIIT serves as an incubator for turning creative engineering ideas into commercially viable technological products.',
  'published',
  'connected',
  true,
  NOW()
),
(
  'e0000015-0000-0000-0000-000000000013'::uuid,
  'cells-iiic',
  '/cells/iiic',
  'Industry-Institute Interaction Cell (IIIC)',
  'Bridging academic curricula with enterprise requirements through industrial visits, MoUs, and internships.',
  'Facilitating corporate internships, sponsored industrial projects, and corporate guest lectures.',
  '## Industry-Institute Interaction Cell

The IIIC forges enduring partnerships between the college and prominent technology corporations, promoting technical workshops, faculty industrial sabbaticals, and live capstone projects.',
  'published',
  'connected',
  true,
  NOW()
),
(
  'e0000015-0000-0000-0000-000000000014'::uuid,
  'cells-women-empowerment',
  '/cells/women-empowerment',
  'Women Empowerment Cell',
  'Championing female leadership, gender awareness, wellness seminars, and professional self-reliance.',
  'Promoting women engineers through leadership workshops, health awareness, and career guidance.',
  '## Women Empowerment Cell

Dedicated to empowering female students and faculty members through career advancement seminars, self-defense workshops, legal awareness discussions, and leadership mentorship.',
  'published',
  'connected',
  true,
  NOW()
),
(
  'e0000015-0000-0000-0000-000000000015'::uuid,
  'cells-anti-ragging',
  '/cells/anti-ragging',
  'Anti-Ragging Cell & Flying Squad',
  'Ensuring a 100% ragging-free campus with proactive vigil, CCTV monitoring, and strict compliance measures.',
  'Institutional anti-ragging squad, emergency helpline contacts, and undertaking affidavit procedures.',
  '## Zero-Tolerance Anti-Ragging Framework

Ragging in any form is completely banned inside and outside the campus. In accordance with Supreme Court guidelines and UGC/AICTE regulations, a dedicated Anti-Ragging Committee and Flying Squad maintain continuous vigilance.',
  'published',
  'connected',
  true,
  NOW()
),
(
  'e0000015-0000-0000-0000-000000000016'::uuid,
  'cells-anti-narcotic',
  '/cells/anti-narcotic',
  'Anti-Narcotic & Substance Vigilance Cell',
  'Promoting healthy, substance-free campus living through vigilance, youth counseling, and awareness campaigns.',
  'Dedicated cell collaborating with Kerala Excise Vimukthi Mission for substance abuse prevention.',
  '## Substance-Free Campus Mission

The Anti-Narcotic Cell conducts regular awareness seminars, anti-drug oaths, student counseling sessions, and campus vigilance sweeps to ensure an inspiring and healthy academic atmosphere.',
  'published',
  'connected',
  true,
  NOW()
)
ON CONFLICT (route_path) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 3. STRUCTURED CONTENT BLOCKS (public.content_blocks)
-- ----------------------------------------------------------------------------

-- 3.1 Hostel Specifications
INSERT INTO public.content_blocks (
  key, title, block_type, content, structured_data, status, updated_at
) VALUES (
  'hostel_specs',
  'Hostel Facility Specifications & Location',
  'json',
  'Hostel accommodation specs for boys and girls in LMS compound Palayam.',
  '{
    "location": "LMS compound, Palayam",
    "distance": "Located just 2.5 km away from the college campus.",
    "security": "24/7 Security & Warden Supervision",
    "mess_type": "Nutritious Vegetarian & Non-Vegetarian Mess",
    "curfew_time": "6:30 PM",
    "contact_phone": "+91 9496981555 (College Enquiry)"
  }'::jsonb,
  'published',
  NOW()
) ON CONFLICT (key) DO NOTHING;

-- 3.2 Library E-Resource Portals
INSERT INTO public.content_blocks (
  key, title, block_type, content, structured_data, status, updated_at
) VALUES (
  'library_portal_links',
  'Library Online Access Portals (Knimbus, DELNET, NDLI)',
  'json',
  'Links to subscribed e-resources and national digital library databases.',
  '{
    "portals": [
      {
        "name": "Knimbus e-Library Platform",
        "tag": "Digital Library Portal",
        "description": "Access over 10,000+ open access and subscribed e-books, e-journals, and engineering research databases through a centralized discovery interface.",
        "features": [
          "24/7 Off-campus remote digital access",
          "Comprehensive engineering and technology collection",
          "Mobile-friendly app access on iOS and Android",
          "Dedicated research alerts and personalized bookshelves"
        ],
        "url": "https://jcmcsiit.knimbus.com",
        "badge": "Subscribed Portal",
        "color": "violet"
      },
      {
        "name": "DELNET — Developing Library Network",
        "tag": "Union Catalogue & Inter-Library Loan",
        "description": "Network connecting over 7,500+ institutional libraries across South Asia, facilitating inter-library loan and document delivery services.",
        "features": [
          "Union catalogue of books, journals, and articles",
          "Document delivery service for specialized research papers",
          "Access to Cambridge, Oxford, and Springer archives",
          "Inter-library lending network coverage across India"
        ],
        "url": "https://www.delnet.in",
        "badge": "Institutional Member",
        "color": "emerald"
      },
      {
        "name": "National Digital Library of India (NDLI)",
        "tag": "MHRD Initiative / IIT Kharagpur",
        "description": "Virtual repository of learning resources sponsored by the Ministry of Education, Government of India, supporting multidisciplinary research.",
        "features": [
          "Over 10+ crore educational assets in multiple languages",
          "School, undergraduate, postgraduate, and research levels",
          "Free access to thesis, video lectures, and simulation tools",
          "Institutional club activities and knowledge webinars"
        ],
        "url": "https://ndl.iitkgp.ac.in",
        "badge": "Govt. of India",
        "color": "blue"
      }
    ]
  }'::jsonb,
  'published',
  NOW()
) ON CONFLICT (key) DO NOTHING;

-- 3.3 Transportation Routes & Coordinator
INSERT INTO public.content_blocks (
  key, title, block_type, content, structured_data, status, updated_at
) VALUES (
  'transportation_routes_json',
  'Campus Transportation Bus Routes & In-Charge Contact',
  'json',
  'Complete bus routes, pickup points, and transportation coordinator info.',
  '{
    "coordinator": {
      "name": "Mr. Sanjit J",
      "role": "Transport In-Charge",
      "dept": "Assistant Professor, ME",
      "phone": "+91 9496981555 (Institutional Enquiry)",
      "email": "transport@jcmcsiit.ac.in",
      "notes": "For queries related to bus routes, timings, boarding passes, or transport-related assistance, please contact the coordinator during office hours."
    },
    "routes": [
      {
        "id": 1,
        "name": "Route 1: City Line (East Fort - Peroorkada)",
        "color": "emerald",
        "stops": [
          "East Fort", "Thampanoor", "Overbridge", "Ayurveda College", "Statue",
          "Palayam", "PMG", "Pattom", "Marappalam", "Kowdiar", "Ambalamukku",
          "Peroorkada", "Mannanthala", "College Campus"
        ]
      },
      {
        "id": 2,
        "name": "Route 2: Coastal Line (Attingal - Kazhakkoottam)",
        "color": "blue",
        "stops": [
          "Attingal KSRTC", "Mamom", "Korani", "Thonnakkal", "Mangalapuram",
          "Veiloor", "Murukkumpuzha", "Kaniyapuram", "Vetturoad", "Kazhakkoottam",
          "Sreekariyam", "Chanthavila", "Pothencode", "College Campus"
        ]
      },
      {
        "id": 3,
        "name": "Route 3: South Line (Neyyattinkara - Balaramapuram)",
        "color": "violet",
        "stops": [
          "Karakonam", "Kunnathukal", "Manivila", "Parasuvakkal", "Udiyankulangara",
          "Amaravila", "Neyyattinkara", "Vazhimukku", "Balaramapuram", "Vedivachankovil",
          "Pravachambalam", "Nemom", "Pappanamcode", "Karamana", "Killippalam",
          "Vazhuthakkad", "College Campus"
        ]
      }
    ]
  }'::jsonb,
  'published',
  NOW()
) ON CONFLICT (key) DO NOTHING;

-- 3.4 Alumni Spotlight Profiles (Sample / Template records for Admin editing)
INSERT INTO public.content_blocks (
  key, title, block_type, content, structured_data, status, updated_at
) VALUES (
  'alumni_spotlight_profiles',
  'Alumni Spotlight & Career Profiles (Sample Templates)',
  'json',
  'Template entries for prominent alumni achievements. Replace with verified alumni records in Admin.',
  '{
    "_note": "Sample template records for CMS demonstration. Update with official alumni records.",
    "alumni": [
      {
        "name": "Sample Alumnus A",
        "batch": "2020",
        "role": "Software Engineer (Sample Profile)",
        "location": "Bangalore, India"
      },
      {
        "name": "Sample Alumnus B",
        "batch": "2019",
        "role": "Data Analyst (Sample Profile)",
        "location": "Hyderabad, India"
      },
      {
        "name": "Sample Alumnus C",
        "batch": "2021",
        "role": "Design Engineer (Sample Profile)",
        "location": "Kochi, India"
      },
      {
        "name": "Sample Alumnus D",
        "batch": "2018",
        "role": "Technical Lead (Sample Profile)",
        "location": "Trivandrum, India"
      }
    ]
  }'::jsonb,
  'published',
  NOW()
) ON CONFLICT (key) DO NOTHING;

-- 3.5 NSS Unit Details & Impact Stats
INSERT INTO public.content_blocks (
  key, title, block_type, content, structured_data, status, updated_at
) VALUES (
  'nss_unit_details',
  'NSS Unit 245 Program Details & Statistics',
  'json',
  'Official NSS unit details, annual volunteer count, and program officers.',
  '{
    "unit_number": "245",
    "motto": "Not Me, But You",
    "program_officer": "[To be confirmed by Department]",
    "officer_designation": "NSS Program Officer",
    "stats": [
      { "label": "Active Volunteers", "value": "100+" },
      { "label": "Blood Donation Units", "value": "250+" },
      { "label": "Saplings Planted", "value": "1000+" },
      { "label": "Adopted Communities", "value": "Campus & Surrounds" }
    ]
  }'::jsonb,
  'published',
  NOW()
) ON CONFLICT (key) DO NOTHING;

-- 3.6 IEEE Student Branch Societies
INSERT INTO public.content_blocks (
  key, title, block_type, content, structured_data, status, updated_at
) VALUES (
  'ieee_societies_data',
  'IEEE Student Branch STB64571 & Technical Societies',
  'json',
  'IEEE Student branch chapters including RAS, SAS, and WIE.',
  '{
    "branch_code": "STB64571",
    "counselor": "[To be confirmed by Department]",
    "societies": [
      {
        "name": "IEEE Robotics & Automation Society (RAS)",
        "code": "RAS SBC",
        "description": "Focusing on autonomous robotics, mechatronics, and hands-on microcontroller hackathons."
      },
      {
        "name": "IEEE Systems, Man, and Cybernetics Society (SAS)",
        "code": "SAS SBC",
        "description": "Dedicated to intelligent systems, data mining, and smart industrial automation."
      },
      {
        "name": "IEEE Women in Engineering Affinity Group (WIE)",
        "code": "WIE AG",
        "description": "Empowering women engineers, tech mentoring, and school outreach STEM initiatives."
      }
    ]
  }'::jsonb,
  'published',
  NOW()
) ON CONFLICT (key) DO NOTHING;

-- 3.7 Anti-Ragging Helplines
INSERT INTO public.content_blocks (
  key, title, block_type, content, structured_data, status, updated_at
) VALUES (
  'anti_ragging_helplines',
  'Anti-Ragging Emergency Helpline Contacts',
  'contact',
  'National and institutional 24/7 anti-ragging contact numbers and email helplines.',
  '{
    "national_toll_free": "1800-180-5522",
    "national_email": "helpline@antiragging.in",
    "principal_contact": "+91 9496981555 (Institutional Helpline)",
    "local_police_station": "Medical College PS: 0471-2444243"
  }'::jsonb,
  'published',
  NOW()
) ON CONFLICT (key) DO NOTHING;

COMMIT;
